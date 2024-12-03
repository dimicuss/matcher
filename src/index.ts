import {searchPersons} from 'lib/search-person'
import {createTrie} from 'lib/create-trie'
import {Person} from 'types'

export const search = (text: string) => {
  const trie = createTrie(text)
  return (persons: Person[]) => searchPersons(persons, trie)
}

