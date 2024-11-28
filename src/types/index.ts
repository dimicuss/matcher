import persons from '../data/persons.json'

export type Person = (typeof persons)[0]

export interface Match {
  start: number
  end: number
  string: string
}

export interface Sequence {
  start: number
  end: number
  name: string[]
}

export interface Position extends Range {
  next: Position | undefined
}

export interface Range {
  start: number
  end: number
}

export interface Word {
  position: Position
  object: string
}

export interface SearchResult {
  person: Person
  ranges: Range[]
  matches: string[]
}
