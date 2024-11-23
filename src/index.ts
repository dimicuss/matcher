import {readFile} from 'fs'
import persons from './data/persons.json'
import {createTrie} from './lib/create-trie'

const trie = createTrie(persons)

readFile(0, (_, data) => {
  console.log(data.toString())
  console.log(trie)
})

