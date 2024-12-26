import {IntersectedPairs, LocalNode, Person, PersonRangePair} from "types";
import {getNode} from "./get-node";

export class PersonLinksHistory {
  dom: LocalNode
  pairs: Set<PersonRangePair>
  intersectedPairs: IntersectedPairs

  constructor(dom: LocalNode, pairs: Set<PersonRangePair>, intersectedPairs: IntersectedPairs) {
    this.dom = dom
    this.pairs = pairs
    this.intersectedPairs = intersectedPairs
  }

  toggle(pair: PersonRangePair) {
    if (this.pairs.has(pair)) {
      const newDom = this.unwrap(pair)
      const nextPairs = new Set(this.pairs)

      nextPairs.delete(pair)

      return new PersonLinksHistory(newDom, nextPairs, this.intersectedPairs)
    }

    const intersectedPairs = this.intersectedPairs.get(pair) || new Set
    const newDom = this.wrap(pair)
    const nextPairs = new Set(this.pairs)

    nextPairs.add(pair)

    for (const intersectedPair of intersectedPairs) {
      nextPairs.delete(intersectedPair)
    }

    return new PersonLinksHistory(newDom, nextPairs, this.intersectedPairs)
  }

  static create(dom: LocalNode, pairsToSet: PersonRangePair[], intersectedPairs: IntersectedPairs) {
    const pairs = new Set<PersonRangePair>()

    for (const pair of pairsToSet) {
      const [person, range] = pair
      const parentNode = getNode(dom, range.path)?.parentNode

      if (parentNode && parentNode instanceof HTMLAnchorElement && PersonLinksHistory.getPersonId(parentNode.href) === person.id) {
        pairs.add(pair)
      }
    }

    return new PersonLinksHistory(dom, pairs, intersectedPairs)
  }

  static getPersonId(href: string) {
    const id = /person\/(\d+)$/.exec(href)?.[1]

    if (id) {
      return Number(id)
    }

    return undefined
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

    if (node && node.parentElement && node.textContent) {
      if (node.parentElement instanceof HTMLAnchorElement) {
        node.parentElement.href = `model://person/${person.id}`
      } else {
        const pre = node.textContent.substring(0, range.start)
        const post = node.textContent.substring(range.end, Infinity)

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

    return clonedDom as LocalNode
  }
}
