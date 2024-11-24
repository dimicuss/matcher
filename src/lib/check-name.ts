import {Node} from "./create-trie";

export const checkName = (trie: Node, names: string[]) => {
  let currentNode: Node | undefined = trie

  for (const name of names) {
    const nextNode = currentNode.links.get(name)

    if (nextNode) {
      currentNode = nextNode
    } else {
      break
    }
  }

  return currentNode.persons
}
