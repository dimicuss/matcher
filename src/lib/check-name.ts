import {Node} from "./create-trie";

export const checkName = (trie: Node, names: string[]) => {
  let currentNode: Node | undefined = trie

  for (const nameToSplit of names) {
    for (const name of nameToSplit.split(' ')) {
      currentNode = currentNode?.links?.get(name)
    }
  }

  return currentNode?.persons || new Set()
}
