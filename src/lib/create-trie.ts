import {Word} from "types"
import {Position} from "types"

export const createTrie = (text: string) => {
  const root = new Node()
  const regex = /[-a-zA-Zа-яёА-ЯЁ]+/g

  let match: RegExpExecArray | null
  let previousPosition: Position | undefined

  while ((match = regex.exec(text)) !== null) {
    const object = match[0]

    const position = {
      start: match.index,
      end: match.index + object.length,
      length: object.length,
      next: undefined
    }

    if (previousPosition) {
      previousPosition.next = position
    }

    previousPosition = position

    addToTrie({object, position}, root)
  }

  return root
}

const addToTrie = (word: Word, trie: Node) => {
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

  node.positions.push(word.position)
}


export class Node {
  positions: Position[] = []
  links = new Map<string, Node>()
}

