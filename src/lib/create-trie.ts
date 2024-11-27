import {Word} from "types"
import {Position} from "types"

const alphaRegex = /[-a-zA-Zа-яёА-ЯЁ]/

export const createTrie = (text: string) => {
  const root = new Node()
  let object: string[] = []
  let startIndex: number | undefined
  let previousPosition: Position | undefined

  for (let i = 0; i < text.length + 1; i++) {
    const char = text[i]

    if (char !== undefined && char.match(alphaRegex)) {
      if (startIndex === undefined) {
        startIndex = i
      }

      object.push(char)
    } else if (object.length > 0 && startIndex !== undefined) {
      const position = {
        start: startIndex,
        end: startIndex + object.length,
        next: undefined
      }

      if (previousPosition) {
        previousPosition.next = position
      }

      previousPosition = position

      addToTrie({object, position}, root)

      startIndex = undefined
      object = []
    }
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

