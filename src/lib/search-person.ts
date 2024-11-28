import {Person, Position, Range} from "types"
import {Node} from "./create-trie"
import {rangeMemo} from "./range-memo"

const MAX_DIFF = 3
const SEARCH_FACTOR = 0.75

export const searchPersons = (persons: Person[], trie: Node) => {
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

  return result
}

export const searchWord = (wordToSplit: string, trie: Node) => {
  const positions: Position[] = []

  for (const word of wordToSplit.split(' ')) {
    let hits = 0
    let node = trie
    for (const char of word) {
      const nextNode = node.links.get(char)

      if (nextNode) {
        hits++
        node = nextNode
      } else break
    }

    if (hits / word.length >= SEARCH_FACTOR) {
      for (const position of bfs(node)) {
        if (Math.abs(hits - position.length) <= MAX_DIFF) {
          positions.push(position)
        }
      }
    }
  }

  return mergePositions(positions)
}

const mergePositions = (positionsToClone: Position[]) => {
  const result: Range[] = []
  const positions = [...positionsToClone].sort((a, b) => a.start - b.start)

  let lastPosition: Position | undefined

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i]

    if (lastPosition === undefined) {
      lastPosition = position
    }

    const nextPosition = positions[i + 1]

    if (nextPosition === undefined || position.next === undefined || position.next !== nextPosition) {
      if (lastPosition !== position) {
        result.push(rangeMemo({
          start: lastPosition.start,
          end: position.end
        }))
      }

      lastPosition = undefined
    }
  }

  return result
}



const bfs = (node: Node) => {
  const result: Position[] = []
  const callStack = [node]

  while (callStack.length > 0) {
    const node = callStack.shift() as Node

    if (node.positions.length) {
      result.push(...node.positions)
    }

    for (const nextNode of node.links.values()) {
      callStack.push(nextNode)
    }
  }

  return result
}
