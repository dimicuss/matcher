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

  node.end = {
    start: word.start,
    end: word.start + word.object.length,
  }
}

export class Node {
  end: {
    start: number
    end: number
  } | undefined
  links = new Map<string, Node>()
}

interface Word {
  start: number
  object: string[]
}
