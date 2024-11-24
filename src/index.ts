import {readFile} from 'fs'
import persons from './data/persons.json'
import {createTrie} from './lib/create-trie'
import {getCandidates} from './lib/get-candidates'
import {log} from './lib/logging'

const trie = createTrie(persons)

readFile(0, (_, data) => {
  const result = getCandidates(trie, data.toString())
  log(result)
})



