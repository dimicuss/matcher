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
  parent: Node
}

export interface TypedRange {
  range: Range
  type: 'middleName' | 'firstName' | 'lastName'
}


