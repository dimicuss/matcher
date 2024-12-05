import {Range, TypedRange} from "types"

const memo = new Map<string, Range | null>()

export const createRange = (ranges: TypedRange[]): Range => {
  const first = ranges[0] as TypedRange
  const last = ranges[ranges.length - 1] || first
  const {parent} = first.range

  const word = (parent.textContent || '').substring(first.range.start, last.range.end)

  const range = {
    start: first.range.start,
    end: last.range.end,
    word,
    parent,
    next: undefined
  }

  const key = JSON.stringify(range)

  if (memo.has(key)) {
    return memo.get(key) as Range
  }

  memo.set(key, range)

  return range
}
