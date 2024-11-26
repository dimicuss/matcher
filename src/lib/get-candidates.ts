import {Match, Sequence} from "../types"

const atom = '(?:[A-ZА-ЯЁ][a-zа-яё]+(?:-[a-zа-яё]+)?)'
const space = '\\s+'

const word = `${atom}(?:${space}(?:[a-zа-яё]+)${space}${atom})?`
const reduction = `[A-ZА-ЯЁ]\\.`

const matchers = [
  `(${word})(?=${space}${word})`,
  `(${word})`,
  `(${reduction})(?=(?:\\s?${reduction})|(?:\\s?${word}))`
].join('|')

export const getCandidates = (string: string) => {
  const regex = new RegExp(matchers, 'g')

  let result
  let matchedNames: Sequence[] = []
  let chainedResults: Match[] = []

  const add = (seq: Sequence) => {
    if (seq) {
      matchedNames.push(seq)
    }
  }

  while ((result = regex.exec(string)) !== null) {
    const chainedWord = result[1]
    if (chainedWord) {
      chainedResults.push({
        start: result.index,
        end: result.index + chainedWord.length,
        string: chainedWord
      })
    }

    const word = result[2]
    if (word) {
      chainedResults.push({
        start: result.index,
        end: result.index + word.length,
        string: word
      })

      if (chainedResults.length > 1) {
        add(getSubSequences(chainedResults))
      }

      chainedResults = []
    }

    const reduction = result[3]
    if (reduction) {
      chainedResults.push({
        start: result.index,
        end: result.index + reduction.length,
        string: reduction
      })
    }
  }

  if (chainedResults.length > 1) {
    add(getSubSequences(chainedResults))
  }

  return matchedNames
}

const maxWindowSize = 5
const getSubSequences = (matches: Match[]): Sequence => {
  const result: Sequence[] = []

  for (let windowSize = 2; windowSize <= maxWindowSize; windowSize++) {
    for (let i = 0; i < matches.length - windowSize + 1; i++) {
      const subSequence: Match[] = []

      for (let j = i; j < i + windowSize; j++) {
        subSequence.push(matches[j])
      }

      const name = subSequence.map(({string}) => string)

      result.push({
        start: subSequence[0]?.start,
        end: subSequence[subSequence.length - 1].end,
        name
      })
    }
  }

  return result.sort((a, b) => b.name.length - a.name.length)[0]
}

