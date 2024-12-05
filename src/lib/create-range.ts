import {Range, TypedRange} from "types"

export const createRange = (ranges: TypedRange[]): Range => {
  const first = ranges[0] as TypedRange
  const last = ranges[ranges.length - 1] || first
  const {parent} = first.range

  const word = (parent.textContent || '').substring(first.range.start, last.range.end)

  return {
    start: first.range.start,
    end: last.range.end,
    word,
    parent,
    next: undefined
  }
}
