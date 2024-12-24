import {LocalNode, PersonRangePair} from "types";
import {getNode} from "./get-node";

export const wrap = (dom: LocalNode, pairs: Set<PersonRangePair>) => {
  const clonedNode = dom.cloneNode(true)

  for (const [person, range] of pairs) {
    const node = getNode(clonedNode, range.path) as HTMLElement

    if (node && node.textContent) {
      if (node.parentElement?.nodeName !== 'A') {
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
      } else {
        node.parentElement?.replaceWith(node)
      }
    }
  }

  return clonedNode as LocalNode
}

