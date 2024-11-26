import {Person} from "../types";
import {getPermutations} from "./get-permutations";

const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  if (setA.size > setB.size) {
    return intersection(setB, setA)
  }

  const result = new Set<T>()

  for (const item of setA) {
    if (setB.has(item)) {
      result.add(item)
    }
  }

  return result
}

const intersections = (nodes: [Node, Node, Node]) => {
  let result = nodes[0].persons

  for (let i = 1; i < nodes.length; i++) {
    result = intersection(result, nodes[i].persons)
  }

  return result
}


const addNameToTrie = (person: Person, nameToSplit: string, root: Node) => {
  root.persons.add(person)

  for (const name of nameToSplit.split(' ')) {
    let node = root

    for (let i = 0; i < name.length; i++) {
      const char = name[i]

      if (!node.links.has(char)) {
        node.links.set(char, new Node(i + 1))
      }

      const nextNode = node.links.get(char)
      if (nextNode) {
        nextNode.persons.add(person)
        node = nextNode
      }
    }
  }
}

const searchNameInTrie = (name: string, trie: Node) => {
  let node = trie

  for (const char of name) {
    const nextNode = node.links.get(char)
    if (nextNode === undefined) break
    node = nextNode
  }

  return node
}

export const createNamesTrie = (persons: Person[]) => {
  const lastNames = new Node()
  const firstNames = new Node()
  const middleNames = new Node()

  for (const person of persons) {
    const lastName = person.last_name || ''
    const firstName = person.name || ''
    const middleName = person.middle_name || ''

    addNameToTrie(person, lastName, lastNames)
    addNameToTrie(person, firstName, firstNames)
    addNameToTrie(person, middleName, middleNames)
  }

  return (firstForm = '', secondForm = '', lastForm = '') => {
    const permutations = getPermutations([firstForm, secondForm, lastForm])

    let maximumPoints = 0
    let maximumNodes: [Node, Node, Node] | undefined

    for (let namesOfPermutation of permutations) {
      const [lastName, firstName, middleName] = namesOfPermutation;
      const lastNameNode = searchNameInTrie(lastName, lastNames)
      const firstNameNode = searchNameInTrie(firstName, firstNames)
      const middleNameNode = searchNameInTrie(middleName, middleNames)

      const nextMaximumPoints = lastNameNode.points + firstNameNode.points + middleNameNode.points

      if (maximumPoints < nextMaximumPoints) {
        maximumPoints = nextMaximumPoints
        maximumNodes = [lastNameNode, firstNameNode, middleNameNode]
      }
    }

    return maximumNodes ? intersections(maximumNodes) : new Set()
  }
}


export class Node {
  persons = new Set<Person>()
  links = new Map<string, Node>()
  points = 0

  constructor(points = 0) {
    this.points = points
  }
}

