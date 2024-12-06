export const mergeRanges = <T>(items: T[], check: (item: T, nextItem: T) => boolean) => {
  const result: T[][] = []
  let mergedItems: T[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const nextItem = items[i + 1]

    if (nextItem === undefined) {
      mergedItems.push(item)
      if (mergedItems.length > 1) result.push(mergedItems)
    } else if (check(item, nextItem)) {
      mergedItems.push(item)
    } else {
      mergedItems.push(item)
      if (mergedItems.length > 1) result.push(mergedItems)
      mergedItems = []
    }
  }

  return result
}
