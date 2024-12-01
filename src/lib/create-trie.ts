import {Range} from "types"

const wordPattern = '[-a-zA-Zа-яёА-ЯЁ]+'
const space = '(?:\\s|\\.\\s|\\.)'
const pattern = `(${wordPattern}(?=${space}${wordPattern}))|(${wordPattern})`

export const createTrie = (text: string) => {
  const root = new Node()
  const regex = new RegExp(pattern, 'g')

  let match: RegExpExecArray | null = null
  let previousRange: Range | undefined

  while ((match = regex.exec(text)) !== null) {
    const word = match[0]
    const chainedWord = match[1]
    const simpleWord = match[2]

    const range: Range = {
      start: match.index,
      end: match.index + word.length,
      next: undefined,
      word,
    }

    if (previousRange) {
      previousRange.next = range
    }

    if (chainedWord) {
      previousRange = range
    }

    if (simpleWord) {
      previousRange = undefined
    }

    addToTrie(range, root)
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

