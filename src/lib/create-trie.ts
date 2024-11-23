import {CASES, Engine, Gender} from "russian-nouns-js";
import {Person} from "../types";

const rne = new Engine()

export const createTrie = (persons: Person[]) => {
  const root = new Node()
  root.persons = persons

  for (const person of persons) {
    let currentNode = root;

    for (const name of [person.last_name, person.name, person.middle_name]) {
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

      node.persons.push(person)
      currentNode = node
    }
  }

  return root
}

class Node {
  persons: Person[] = []
  links = new Map<string, Node>()
}

