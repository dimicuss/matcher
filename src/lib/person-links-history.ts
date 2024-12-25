import {LocalNode, PersonRangePair} from "types";
import {getNode} from "./get-node";

export class PersonLinksHistory {
  pairs: Set<PersonRangePair>
  dom: LocalNode

  constructor(dom: LocalNode, pairs: Set<PersonRangePair>) {
    this.dom = dom
    this.pairs = pairs
  }


  toggle(pair: PersonRangePair) {
    if (this.pairs.has(pair)) {
      const newDom = this.unwrap(pair)
      const nextPairs = new Set(this.pairs)

      nextPairs.delete(pair)

      return new PersonLinksHistory(newDom, nextPairs)
    }

    const newDom = this.wrap(pair)
    const nextPairs = new Set(this.pairs)

    nextPairs.add(pair)

    return new PersonLinksHistory(newDom, nextPairs)
  }

  static create(dom: LocalNode, pairsToSet: PersonRangePair[]) {
    const pairs = new Set<PersonRangePair>()

    for (const pair of pairsToSet) {
      const [, range] = pair
      if (getNode(dom, range.path)?.parentNode?.nodeName === 'A') {
        pairs.add(pair)
      }
    }

    return new PersonLinksHistory(dom, pairs)
  }

  private unwrap(pair: PersonRangePair) {
    const clonedDom = this.dom.cloneNode(true)
    const [, range] = pair
    const node = getNode(clonedDom, range.path) as HTMLElement

    if (node && node.parentElement && node.parentElement.nodeName === 'A' && node.textContent) {
      node.parentElement.replaceWith(node)
    }

    return clonedDom as LocalNode
  }

  private wrap(pair: PersonRangePair) {
    const clonedDom = this.dom.cloneNode(true)
    const [person, range] = pair
    const node = getNode(clonedDom, range.path) as HTMLElement

    if (node && node.parentElement && node.parentElement.nodeName !== 'A' && node.textContent) {
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

    return clonedDom as LocalNode
  }
}
