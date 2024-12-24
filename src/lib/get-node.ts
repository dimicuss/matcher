export const getNode = (root: Node | HTMLElement | DocumentFragment, path: number[]) => {
  let node = root

  for (const index of path) {
    node = node.childNodes[index]
  }

  return node
}
