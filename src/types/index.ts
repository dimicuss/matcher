import persons from '../data/persons.json'

export type Person = (typeof persons)[0]

export interface Range {
  start: number
  end: number
  subString: string
  next: Range | undefined
}

