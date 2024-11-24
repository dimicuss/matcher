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
      for (const name of permutation) {
        const handledName = name || ''

        if (!currentNode.links.has(handledName)) {
          const node = new Node()
          currentNode.links.set(handledName, node)

          if (handledName !== '') {
            for (const gender of [Gender.MASCULINE, Gender.FEMININE]) {
              for (const _case of CASES) {
                const [declinedName] = rne.decline({text: handledName, gender}, _case)
                currentNode.links.set(declinedName, node)
              }
            }
          }
        }

        const node = currentNode.links.get(handledName)

        node.persons.add(person)
        currentNode = node
      }
    }
  }

  return root
}

export class Node {
  persons = new Set<Person>()
  links = new Map<string, Node>()
}

