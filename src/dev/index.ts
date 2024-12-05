import search from '../index'
import persons from '../data/persons.json'

const searchPersons = search(document.body)

console.log(searchPersons(persons))
