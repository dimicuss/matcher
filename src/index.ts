import {readFile} from 'fs'
import {log} from 'lib/logging'
import persons from 'data/persons.json'
import {searchPersons} from 'lib/search-person'
import {createTrie} from 'lib/create-trie'

readFile(0, (_, data) => {
  const text = data.toString()
  const trie = createTrie(text)
  const results = searchPersons(persons, trie, text)

  log(results)
})



