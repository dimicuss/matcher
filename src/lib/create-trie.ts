import {Range} from "types"

export const createTrie = (text: string) => {
  const root = new Node()
  const regex = /(\s+)|([-a-zA-Zа-яёА-ЯЁ]+)|([^-a-zA-Zа-яёА-ЯЁ]+)/g

  let match: RegExpExecArray | null = null
  let previousMatch: RegExpExecArray | null = null
  let previousRange: Range | undefined

  while ((match = regex.exec(text)) !== null) {
    const word = match[2]

    if (word) {
      const range: Range = {
        start: match.index,
        end: match.index + word.length,
        next: undefined,
        word,
      }

      if (previousMatch && previousMatch[3]) {
        previousRange = undefined
      }

      if (previousRange) {
        previousRange.next = range
      }

      previousRange = range

      addToTrie(range, root)
    }

    previousMatch = match
  }

  return {text, root}
}

const addToTrie = (range: Range, trie: Node) => {
  let node = trie
  for (const char of range.word) {
    if (!node.links.has(char)) {
      node.links.set(char, new Node())
    }

    const nextNode = node.links.get(char)

    if (nextNode) {
      node = nextNode
    }
  }

  node.ranges.push(range)
}


export class Node {
  ranges: Range[] = []
  links = new Map<string, Node>()
}

export type Trie = ReturnType<typeof createTrie>

