import {Range} from "types"

export const createTrie = (text: string) => {
  const root = new Node()
  const regex = /[-a-zA-Zа-яёА-ЯЁ]+/g

  let match: RegExpExecArray | null
  let previousRange: Range | undefined

  while ((match = regex.exec(text)) !== null) {
    const subString = match[0]

    const range: Range = {
      start: match.index,
      end: match.index + subString.length,
      subString,
      next: undefined
    }

    if (previousRange) {
      previousRange.next = range
    }

    previousRange = range

    addToTrie(range, root)
  }

  return {text, root}
}

const addToTrie = (range: Range, trie: Node) => {
  let node = trie
  for (const char of range.subString) {
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

