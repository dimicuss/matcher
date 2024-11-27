const alphaRegex = /[a-zA-Zа-яёА-ЯЁ]/

export const createTrie = (string: string) => {
  const root = new Node()
  let word: string[] = []
  let startIndex: number | undefined

  for (let i = 0; i < string.length; i++) {
    const char = string[i]

    if (char.match(alphaRegex)) {
      if (startIndex === undefined) {
        startIndex = i
      }

      word.push(char)
    } else if (word.length > 0 && startIndex !== undefined) {
      addToTrie({
        start: startIndex,
        object: word
      }, root)

      startIndex = undefined
      word = []
    }
  }

  return root
}

export const addToTrie = (word: Word, trie: Node) => {
  let node = trie

  for (const char of word.object) {
    if (!node.links.has(char)) {
      node.links.set(char, new Node())
    }

    const nextNode = node.links.get(char)

    if (nextNode) {
      node = nextNode
    }
  }

  node.end.push({
    start: word.start,
    end: word.start + word.object.length,
  })
}

export const searchWordInTrie = (word: string, trie: Node): Position[] => {
  let hits = 0
  let node = trie

  for (const char of word) {
    const nextNode = node.links.get(char)

    if (nextNode) {
      hits++
      node = nextNode
    } else break
  }

  return hits >= word.length / 2 ? bfs(node) : []
}

const bfs = (node: Node) => {
  const result: Position[] = []
  const callStack = [node]

  while (callStack.length > 0) {
    const node = callStack.shift() as Node

    if (node.end.length) {
      result.push(...node.end)
    }

    for (const nextNode of node.links.values()) {
      callStack.push(nextNode)
    }
  }

  return result
}

export class Node {
  end: Position[] = []
  links = new Map<string, Node>()
}

interface Position {
  start: number
  end: number
}

interface Word {
  start: number
  object: string[]
}
