export const getPermutations = <T>(itemsToClone: T[]) => {
  const result = []
  const items = [...itemsToClone]

  const counters = Array.from({length: items.length}, () => 0)

  result.push(
    [...items]
  )

  let i = 1;
  while (i < items.length) {
    if (counters[i] < i) {
      if (i % 2 === 0) {
        swap(items, 0, i)
      } else {
        swap(items, counters[i], i)
      }

      result.push(
        [...items]
      )

      counters[i] += 1

      i = 1
    } else {
      counters[i] = 0
      i += 1
    }
  }

  return result
}

const swap = <T>(items: T[], iA: number, iB: number) => {
  const toSwap = items[iA]
  items[iA] = items[iB]
  items[iB] = toSwap
}
