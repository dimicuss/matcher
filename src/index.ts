import {readFile} from 'fs'
import persons from 'data/persons.json'
import {searchPersons} from 'lib/search-person'
import {createTrie} from 'lib/create-trie'

readFile(0, (_, data) => {
  const text = data.toString()
  const trie = createTrie(text)
  const results = searchPersons(persons, trie)

  for (const [range, persons] of results) {
    console.log(range.word, range.start, range.end)

    for (const person of persons) {
      console.log('    ', person.title, person.id)
    }
  }
})



