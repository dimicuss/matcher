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
}

export interface TypedRange {
  range: Range
  type: 'middleName' | 'firstName' | 'lastName'
}

export interface MatcherPluginState {
  dom: HTMLElement | DocumentFragment
  matches: [Person, Range][]
}
