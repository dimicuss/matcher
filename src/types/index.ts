import {PersonLinksHistory} from "lib/person-links-history"

export type Person = {
  title: string,
  last_name: string | null,
  middle_name: string | null,
  id: number,
  name: string | null
}

export interface Range {
  start: number
  end: number
  word: string
  next: Range | undefined
  node: Node
  order: number
  path: number[]
}

export interface TypedRange {
  range: Range
  type: 'middleName' | 'firstName' | 'lastName'
}

export type PersonRangePair = [Person, Range]

export interface MatcherPluginState {
  dom: HTMLElement | DocumentFragment
  matches: PersonRangePair[]
  history: PersonLinksHistory
}

export type LocalNode = HTMLElement | DocumentFragment | Node
