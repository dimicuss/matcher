import {create} from '../index'
import persons from './persons.json'

const searchPersons = create(document.body)

console.log(searchPersons(persons))

