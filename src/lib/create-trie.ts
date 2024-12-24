import {Range} from "types"

const wordPattern = '[-a-zA-Zа-яёА-ЯЁ]+'
const space = '(?:\\s|\\.\\s|\\.)'
const pattern = `(${wordPattern}(?=${space}${wordPattern}))|(${wordPattern})`

export const createTrie = (node: Node) => {
  const root = new TrieNode()
  let order = 0

  dfs(node, (node) => {
    if (node.nodeName === '#text' && node.textContent) {
      addTextToTrie(root, node, order)
    }
    order++
  })

  return root
}

const addTextToTrie = (root: TrieNode, node: Node, order: number) => {
  const text = node.textContent || ''
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
      word,
      node,
      order,
      next: undefined,
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

    let currentNode = root

    for (const char of range.word) {
      if (!currentNode.links.has(char)) {
        currentNode.links.set(char, new TrieNode())
      }

      currentNode = currentNode.links.get(char) as TrieNode
    }

    currentNode.ranges.push(range)
  }
}

const dfs = (node: Node, cb: (range: Node) => void) => {
  const callStack = [node]

  while (callStack.length > 0) {
    const node = callStack.pop() as Node

    cb(node)

    const nodes = Array.from(node.childNodes)

    for (let i = nodes.length - 1; i >= 0; i--) {
      const nextNode = nodes[i]
      callStack.push(nextNode)
    }
  }
}


export class TrieNode {
  ranges: Range[] = []
  links = new Map<string, TrieNode>()
}

