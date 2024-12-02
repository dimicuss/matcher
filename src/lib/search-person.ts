import {Person, Range} from "types"
import {Node, Trie} from "./create-trie"
import {rangeMemo} from "./range-memo"
import {removeDuplicates} from "./remove-duplicates"

const MAX_DIFF = 3
const SEARCH_FACTOR = 0.75

export const searchPersons = (persons: Person[], trie: Trie) => {
  const result = new Map<Range, Set<Person>>()

  for (const person of persons) {
    const {title} = person
    const ranges = title ? searchWord(title, trie) : []

    for (const range of ranges) {
      if (!result.has(range)) {
        result.set(range, new Set())
      }

      result.get(range)?.add(person)
    }
  }

  return new Map(removeDuplicates([...result].sort(([a], [b]) => a.start - b.start), ([range]) => range.word))
}

export const searchWord = (wordToSplit: string, trie: Trie) => {
  const ranges = new Set<Range>()

  for (const word of wordToSplit.split(' ')) {
    let hits = 0
    let node = trie.root

    for (const char of word) {
      const nextNode = node.links.get(char)

      if (nextNode) {
        hits++
        node = nextNode

        if (hits / word.length >= SEARCH_FACTOR) {
          for (const range of bfs(node)) {
            if (Math.abs(hits - range.word.length) <= MAX_DIFF) {
              ranges.add(range)
            }
          }

          break
        }
      } else break
    }
  }

  return mergePositions(ranges, trie)
}

const mergePositions = (positionsToClone: Set<Range>, trie: Trie) => {
  const result: Range[] = []
  const ranges = [...positionsToClone].sort((a, b) => a.start - b.start)

  let lastRanges: Range | undefined

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]

    if (lastRanges === undefined) {
      lastRanges = range
    }

    const nextPosition = ranges[i + 1]

    if (nextPosition === undefined || range.next === undefined || range.next !== nextPosition) {
      if (lastRanges !== range) {
        result.push(rangeMemo({
          start: lastRanges.start,
          end: range.end,
          word: trie.text.substring(lastRanges.start, range.end),
          next: undefined
        }))
      }

      lastRanges = undefined
    }
  }

  return result
}

const getShortName = (person: Person) => {
  const middleName = person.middle_name?.[0] || ''
  const lastName = person.last_name || ''
  const firstName = person.name[0] || ''

  return lastName && (middleName || firstName) ? [firstName[0], middleName[0], lastName].filter(Boolean).join(' ') : ''
}

const bfs = (node: Node) => {
  const result: Range[] = []
  const callStack = [node]

  while (callStack.length > 0) {
    const node = callStack.shift() as Node

    result.push(...node.ranges)

    for (const nextNode of node.links.values()) {
      callStack.push(nextNode)
    }
  }

  return result
}
