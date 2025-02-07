export const getNode = (root: Node | HTMLElement | DocumentFragment, path: number[]): Node => {
  let node = root

  for (const index of path) {
    const child = node.childNodes[index]
    if (!child) break
    node = child
  }

  return node
}
