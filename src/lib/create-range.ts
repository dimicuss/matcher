import {Range, TypedRange} from "types"

export const createRange = (ranges: TypedRange[]): Range => {
  const first = ranges[0] as TypedRange
  const last = ranges[ranges.length - 1] || first
  const {node} = first.range

  const word = (node.textContent || '').substring(first.range.start, last.range.end)

  return {
    start: first.range.start,
    end: last.range.end,
    word,
    node,
    next: undefined,
    order: first.range.order
  }
}
