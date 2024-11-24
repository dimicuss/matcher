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
  persons: Set<Person>
  name: string[]
}
