import {create} from '../index'
import persons from '../data/persons.json'

const searchPersons = create(document.body)

console.log(searchPersons(persons))
