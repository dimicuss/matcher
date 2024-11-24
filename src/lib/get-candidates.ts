import {Match, Sequence} from "index"
import {Node} from "./create-trie"
import {checkName} from "./check-name"

const atom = '(?:[А-ЯЁ][а-яёА-ЯЁ]+(?:-[а-яА-ЯЁ]+)?)'
const space = '\\s+'
const infixes = ['да', 'дер']

const word = `${atom}(?:${space}(?:${infixes.join('|')})${space}${atom})?`
const reduction = `[А-ЯЁ]\\.`

const matchers = [
  `(${word})(?=${space}${word})`,
  `(${word})`,
  `(${reduction})(?=(?:\\s?${reduction})|(?:\\s?${word}))`
].join('|')

export const getCandidates = (trie: Node, string: string) => {
  const regex = new RegExp(matchers, 'g')

  let result
  let matchedNames: Sequence[][] = []
  let chainedResults: Match[] = []

  const add = (seq: Sequence[]) => {
    if (seq.length > 0) {
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
        add(getSubSequences(trie, chainedResults))
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
    add(getSubSequences(trie, chainedResults))
  }

  return matchedNames
}

const maxWindowSize = 3
const getSubSequences = (trie: Node, matches: Match[]): Sequence[] => {
  const result: Sequence[] = []

  for (let windowSize = 2; windowSize <= maxWindowSize; windowSize++) {
    for (let i = 0; i < matches.length - windowSize + 1; i++) {
      const subSequence: Match[] = []

      for (let j = i; j < i + windowSize; j++) {
        subSequence.push(matches[j])
      }

      const name = subSequence.map(({string}) => string)
      const persons = checkName(trie, name)

      if (persons.size > 0) {
        result.push({
          start: subSequence[0]?.start,
          end: subSequence[subSequence.length - 1].end,
          persons,
          name
        })
      }
    }
  }

  return result
}

