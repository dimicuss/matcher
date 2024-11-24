import {CASES, Engine, Gender} from "russian-nouns-js";
import {Person} from "../types";
import {getPermutations} from "./get-permutations";

const rne = new Engine()

export const createTrie = (persons: Person[]) => {
  const root = new Node()

  for (const person of persons) {
    const namesPermutations = getPermutations([person.last_name, person.name, person.middle_name])

    for (const permutation of namesPermutations) {
      let currentNode = root;
      for (const nameOfPermutation of permutation) {
        const nameToSplit = nameOfPermutation || ''

        for (const name of nameToSplit.split(' ')) {
          if (!currentNode.links.has(name)) {
            const node = new Node()
            currentNode.links.set(name, node)

            if (name !== '') {
              for (const gender of [Gender.MASCULINE, Gender.FEMININE]) {
                for (const _case of CASES) {
                  const [declinedName] = rne.decline({text: name, gender}, _case)
                  currentNode.links.set(declinedName, node)
                }
              }
            }
          }

          const node = currentNode.links.get(name)

          node.persons.add(person)
          currentNode = node
        }
      }
    }
  }

  return root
}

export class Node {
  persons = new Set<Person>()
  links = new Map<string, Node>()
}

