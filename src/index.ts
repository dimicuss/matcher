import {readFile} from 'fs'
import {log} from 'lib/logging'
import persons from 'data/persons.json'
import {searchPerson} from 'lib/search-person'
import {createTrie} from 'lib/create-trie'

readFile(0, (_, data) => {
  const string = data.toString()
  const trie = createTrie(string)

  const results = persons
    .map((person) => searchPerson(person, trie))
    .filter(({ranges}) => ranges.length > 0)
    .map(({person, ranges}) => ({
      person,
      matches: ranges.map(({start, end}) => string.substring(start, end))
    }))

  log(results)
})



