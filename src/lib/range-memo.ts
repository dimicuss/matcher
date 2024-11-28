import {Range} from "types"

const memo = new Map<string, Range>()

export const rangeMemo = (range: Range) => {
  const key = JSON.stringify(range)

  if (memo.has(key)) {
    return memo.get(key) as Range
  }

  memo.set(key, range)

  return range
}
