export const removeDuplicates = <T, K>(items: T[], key: (item: T) => K) => {
  const set = new Set<K>()
  const result: T[] = []

  for (const item of items) {
    if (!set.has(key(item))) {
      result.push(item)
      set.add(key(item))
    }
  }

  return result
}
