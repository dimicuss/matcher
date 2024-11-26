import {readFile} from 'fs'
import persons from './data/persons.json'
import {createNamesTrie} from './lib/create-trie'
import {getCandidates} from './lib/get-candidates'
import {log} from './lib/logging'

const searchName = createNamesTrie(persons)


readFile(0, (_, data) => {
  log(
    getCandidates(data.toString())
      .map(({...props}) => ({
        ...props,
        props: searchName(...props.name)
      }))
  )
})



