import {Person, Range, TypedRange} from "types"
import {TrieNode, Trie} from "./create-trie"
import {removeDuplicates} from "./remove-duplicates"
import {createRange} from "./create-range"

const MAX_DIFF = 3
const SEARCH_FACTOR = 0.75

export const searchPersons = (persons: Person[], trie: Trie) => {
  const result = new Map<Person, Range>()

  for (const person of persons) {
    const firstRange = searchFullPerson(person, trie).sort(([a], [b]) => a.range.start - b.range.start)[0]

    if (firstRange && !result.has(person)) {
      result.set(person, createRange(firstRange))
    }

    const firstShortedRange = searchShortPerson(person, trie).sort(([a], [b]) => a.range.start - b.range.start)[0]

    if (firstShortedRange && !result.has(person)) {
      result.set(person, createRange(firstShortedRange))
    }
  }

  return result
}

const searchFullPerson = (person: Person, trie: Trie) => {
  const ranges: TypedRange[] = []

  const lastName = person.last_name || ''
  const firstName = person.name || ''
  const middleName = person.middle_name || ''

  if (lastName) {
    searchWord(lastName, trie, (range) => ranges.push({range, type: 'lastName'}))
  }

  if (firstName) {
    searchWord(firstName, trie, (range) => ranges.push({range, type: 'firstName'}))
  }

  if (middleName) {
    searchWord(middleName, trie, (range) => ranges.push({range, type: 'middleName'}))
  }

  ranges.sort((a, b) => a.range.start - b.range.start)

  return mergeRanges(ranges, (a, b) => a.range.next !== undefined && a.range.next === b.range)
}

const searchShortPerson = (person: Person, trie: Trie) => {
  let ranges: TypedRange[] = []

  const lastName = person.last_name || ''
  const firstName = person.name?.[0] || ''
  const middleName = person.middle_name?.[0] || ''

  if (lastName) {
    searchWord(lastName, trie, (range) => ranges.push({range, type: 'lastName'}))
  }

  if (firstName) {
    searchWord(firstName, trie, (range) => ranges.push({range, type: 'firstName'}))
  }

  if (middleName) {
    searchWord(middleName, trie, (range) => ranges.push({range, type: 'middleName'}))
  }

  const handledRanges = removeDuplicates(ranges, ({range}) => range).sort((a, b) => a.range.start - b.range.start)

  return mergeRanges(handledRanges, (a, b) => a.range.next !== undefined && a.range.next === b.range)
    .filter((ranges) => ranges.find(({type}) => type === 'lastName') && ranges.find(({type}) => type === 'firstName'))
}

const mergeRanges = <T>(items: T[], check: (item: T, nextItem: T) => boolean) => {
  const result: T[][] = []
  let mergedItems: T[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const nextItem = items[i + 1]

    if (nextItem === undefined) {
      mergedItems.push(item)
      if (mergedItems.length > 1) result.push(mergedItems)
    } else if (check(item, nextItem)) {
      mergedItems.push(item)
    } else {
      mergedItems.push(item)
      if (mergedItems.length > 1) result.push(mergedItems)
      mergedItems = []
    }
  }

  return result
}

const searchWord = (wordToSplit: string, trie: Trie, cb: (range: Range) => void) => {
  for (const word of wordToSplit.split(' ')) {
    let hits = 0
    let node: TrieNode = trie.root

    for (const char of word) {
      const nextNode = node.links.get(char)

      if (nextNode) {
        hits++
        node = nextNode
      } else break
    }

    if (hits / word.length >= SEARCH_FACTOR) dfs(node, (range) => {
      if (Math.abs(hits - range.word.length) <= MAX_DIFF) cb(range)
    })
  }
}

const dfs = (node: TrieNode, cb: (range: Range) => void) => {
  const callStack = [node]

  while (callStack.length > 0) {
    const node = callStack.pop() as TrieNode

    for (const range of node.ranges) {
      cb(range)
    }

    for (const nextNode of node.links.values()) {
      callStack.push(nextNode)
    }
  }
}


