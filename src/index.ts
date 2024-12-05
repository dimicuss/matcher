import {searchPersons} from 'lib/search-person'
import {createTrie} from 'lib/create-trie'
import {Person} from 'types'

export const create = (node: Node) => {
  const trie = createTrie(node)
  return (persons: Person[]) => searchPersons(persons, trie)
}

