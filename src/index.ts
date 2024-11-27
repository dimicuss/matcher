import {readFile} from 'fs'
import {log} from './lib/logging'
import persons from './data/persons.json'
import {createTrie, searchWordInTrie} from './lib/create-trie'

readFile(0, (_, data) => {
  const string = data.toString()
  const trie = createTrie(string)
  const results: string[][] = []

  persons.forEach(({name}) => {
    const seachResult = searchWordInTrie(name || '', trie)

    if (seachResult.length) {
      results.push(
        seachResult.map(({start, end}) => string.substring(start, end))
      )
    }
  })

  log(results)
})



