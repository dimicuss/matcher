import {Person, Position, Range, SearchResult} from "types"
import {Node} from "./create-trie"

const SEARCH_FACTOR = 0.75

export const searchPersons = (persons: Person[], trie: Node, text: string) => {
  const results: SearchResult[] = []

  for (const person of persons) {
    const {title} = person
    const ranges = title ? searchWord(title, trie) : []

    if (ranges.length) {
      results.push({
        person,
        ranges,
        matches: ranges.map(({start, end}) => text.substring(start, end))
      })
    }
  }

  return results
}

export const searchWord = (wordToSplit: string, trie: Node) => {
  const ranges: Range[] = []
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

    if (word.length > 1 && hits >= word.length * SEARCH_FACTOR) {
      positions.push(...bfs(node))
    }
  }

  positions.sort((a, b) => a.start - b.start)

  let lastPosition: Position | undefined

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i]

    if (lastPosition === undefined) {
      lastPosition = position
    }

    const nextPosition = positions[i + 1]

    if (nextPosition === undefined || position.next === undefined || position.next !== nextPosition) {
      if (lastPosition !== position) {
        ranges.push({
          start: lastPosition.start,
          end: position.end
        })
      }

      lastPosition = undefined
    }
  }

  return ranges
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
