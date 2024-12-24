import {Person, Range, TypedRange} from "types"
import {TrieNode} from "./create-trie"
import {removeDuplicates} from "./remove-duplicates"
import {createRange} from "./create-range"
import {mergeRanges} from "./merge-ranges"

const MAX_DIFF = 3
const SEARCH_FACTOR = 0.75

export const searchPersons = (persons: Person[], trie: TrieNode) => {
  const result = new Map<Person, Range>()

  for (const person of persons) {
    const firstRange = searchFullPerson(person, trie)[0] || []
    const firstShortedRange = searchShortPerson(person, trie)[0] || []

    const maximalRange = [
      firstRange,
      firstShortedRange
    ].sort((a, b) => b.length - a.length)[0]

    if (maximalRange && maximalRange.length && !result.has(person)) {
      result.set(person, createRange(maximalRange))
    }
  }

  return [...result]
}

const searchFullPerson = (person: Person, trie: TrieNode) => {
  const ranges: TypedRange[] = []

  const lastName = person.last_name || ''
  const firstName = person.name || ''
  const middleName = person.middle_name || ''

  if (lastName) {
    searchWord(lastName, trie, (range) => ranges.push({range, type: 'lastName'}))
  }

  if (firstName) {
    searchWord(firstName, trie, (range) => ranges.push({range, type: 'firstName'}))
  }

  if (middleName) {
    searchWord(middleName, trie, (range) => ranges.push({range, type: 'middleName'}))
  }

  ranges.sort(sortRanges)

  const mergedRanges = mergeRanges(ranges, (a, b) => a.range.next !== undefined && a.range.next === b.range)

  return lastName && firstName || firstName && middleName
    ? mergedRanges.filter((ranges) =>
      ranges.find(({type}) => type === 'lastName') && ranges.find(({type}) => type === 'firstName') ||
      ranges.find(({type}) => type === 'middleName') && ranges.find(({type}) => type === 'firstName'))
    : firstName && !lastName && !middleName
      ? mergedRanges.filter((ranges) => ranges.find(({type}) => type === 'firstName'))
      : []
}

const searchShortPerson = (person: Person, trie: TrieNode) => {
  let ranges: TypedRange[] = []

  const lastName = person.last_name || ''
  const firstName = person.name?.[0] || ''
  const middleName = person.middle_name?.[0] || ''

  if (lastName) {
    searchWord(lastName, trie, (range) => ranges.push({range, type: 'lastName'}))
  }

  if (firstName) {
    searchWord(firstName, trie, (range) => ranges.push({range, type: 'firstName'}))
  }

  if (middleName) {
    searchWord(middleName, trie, (range) => ranges.push({range, type: 'middleName'}))
  }

  const handledRanges = removeDuplicates(ranges, ({range}) => range).sort(sortRanges)

  return mergeRanges(handledRanges, (a, b) => a.range.next !== undefined && a.range.next === b.range)
    .filter((ranges) => ranges.find(({type}) => type === 'lastName') && ranges.find(({type}) => type === 'firstName'))
}

const searchWord = (wordToSplit: string, trie: TrieNode, cb: (range: Range) => void) => {
  let commonHits = 0
  let commonLength = 0
  let nodes: {node: TrieNode, hits: number}[] = []

  for (const word of wordToSplit.split(' ')) {
    let hits = 0
    let node: TrieNode = trie

    for (const char of word) {
      const nextNode = node.links.get(char)

      if (nextNode) {
        hits++
        node = nextNode
      } else break
    }

    commonHits += hits
    commonLength += word.length

    if (hits / word.length >= SEARCH_FACTOR) {
      nodes.push({node, hits})
    }
  }

  if (commonHits / commonLength >= SEARCH_FACTOR) {
    for (const {node, hits} of nodes) dfs(node, (range) => {
      if (Math.abs(hits - range.word.length) <= MAX_DIFF) cb(range)
    })
  }
}

const dfs = (node: TrieNode, cb: (range: Range) => void) => {
  const callStack = [node]

  while (callStack.length > 0) {
    const node = callStack.pop() as TrieNode

    for (const range of node.ranges) {
      cb(range)
    }

    for (const nextNode of node.links.values()) {
      callStack.push(nextNode)
    }
  }
}


const sortRanges = (a: TypedRange, b: TypedRange) => {
  const rangeDiff = a.range.order - b.range.order
  return rangeDiff === 0 ? a.range.start - b.range.start : rangeDiff
}

