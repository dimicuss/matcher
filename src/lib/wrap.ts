import {Person, Range} from "types";
import {getNode} from "./get-node";

export const wrap = (dom: HTMLElement | DocumentFragment | Node, person: Person, range: Range) => {
  const node = getNode(dom, range.path) as HTMLElement

  if (node) {
    if (node.parentElement?.nodeName !== 'A' && node.textContent) {
      const pre = node.textContent?.substring(0, range.start)
      const post = node.textContent?.substring(range.end, Infinity)

      const anchor = document.createElement('a')
      anchor.textContent = range.word
      anchor.href = `model://person/${person.id}`

      const fragment = document.createDocumentFragment()
      const preText = document.createTextNode(pre)
      const postText = document.createTextNode(post)

      fragment.appendChild(preText)
      fragment.appendChild(anchor)
      fragment.appendChild(postText)

      node.replaceWith(fragment)
    }
  }
}
