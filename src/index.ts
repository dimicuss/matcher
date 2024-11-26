import {readFile} from 'fs'
import {log} from './lib/logging'
import {createTrie} from './lib/create-trie'

readFile(0, (_, data) => {
  log(createTrie(data.toString()))
})



