import {Range, TypedRange} from "types"
import {Trie} from "./create-trie"

const memo = new Map<string, Range | null>()

export const createRange = (ranges: TypedRange[], trie: Trie): Range => {
  const first = ranges[0] as TypedRange
  const last = ranges[ranges.length - 1] || first

  const range = {
    start: first.range.start,
    end: last.range.end,
    word: trie.text.substring(first.range.start, last.range.end),
    next: undefined
  }

  const key = JSON.stringify(range)

  if (memo.has(key)) {
    return memo.get(key) as Range
  }

  memo.set(key, range)

  return range
}
