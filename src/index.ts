import {readFile} from 'fs'
import persons from './data/persons.json'
import {createTrie} from './lib/create-trie'
import {getCandidates} from './lib/get-candidates'
import {inspect} from 'util'

const trie = createTrie(persons)

readFile(0, (_, data) => {
  console.log(
    inspect(getCandidates(trie, data.toString()), false, Infinity)
  )
})

