import {Range} from "types"

const wordPattern = '[-a-zA-Zа-яёА-ЯЁ]+'
const space = '(?:\\s|\\.\\s|\\.)'
const pattern = `(${wordPattern}(?=${space}${wordPattern}))|(${wordPattern})`

export const createTrie = (node: Node) => {
  const root = new TrieNode()

  dfs(node, (node) => {
    if (node.nodeName === '#text') {
      const {textContent} = node

      if (textContent) {
        addTextToTrie(root, textContent, node)
      }
    }
  })

  return {root, node}
}

const addTextToTrie = (root: TrieNode, text: string, parent: Node) => {
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
      parent
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

    let node = root

    for (const char of range.word) {
      if (!node.links.has(char)) {
        node.links.set(char, new TrieNode())
      }

      node = node.links.get(char) as TrieNode
    }

    node.ranges.push(range)
  }

  return {text, root}
}

const dfs = (node: Node, cb: (range: Node) => void) => {
  const callStack = [node]

  while (callStack.length > 0) {
    const node = callStack.pop() as Node

    cb(node)

    node.childNodes.forEach((childNode) => {
      callStack.push(childNode)
    })
  }
}


export class TrieNode {
  ranges: Range[] = []
  links = new Map<string, TrieNode>()
}

export type Trie = ReturnType<typeof createTrie>


