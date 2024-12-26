import {Plugin, PluginKey} from "prosemirror-state";
import {serializer} from "lib/schema";
import persons from 'assets/persons.json'
import {MatcherPluginState, PersonRangePair} from "types";
import {create} from "../index";
import {Fragment} from "prosemirror-model";
import {PersonLinksHistory} from "./person-links-history";

export const matcherPluginKey = new PluginKey<MatcherPluginState>('matcher-plugin')

export const matcherPlugin = new Plugin<MatcherPluginState>({
  key: matcherPluginKey,
  state: {
    init: (_, editorState) => createState(editorState.doc.content),
    apply: (t, value) => t.docChanged ? createState(t.doc.content) : value
  }
})

const createIntersectionMap = (pairs: PersonRangePair[]) => {
  const map = new Map<string, Set<PersonRangePair>>

  for (const pair of pairs) {
    const [, range] = pair

    const pathKey = range.path.join(',')

    for (let i = range.start; i <= range.end; i++) {
      const key = `${pathKey},${i}`

      if (!map.has(key)) {
        map.set(key, new Set)
      }

      map.get(key)?.add(pair)
    }
  }

  const resultMap = new Map<PersonRangePair, Set<PersonRangePair>>

  for (const pair of pairs) {
    const [, range] = pair
    const set = new Set<PersonRangePair>

    const pathKey = range.path.join(',')

    for (let i = range.start; i <= range.end; i++) {
      const key = `${pathKey},${i}`
      const intersectedPairs = map.get(key)

      if (intersectedPairs) for (const intersectedPair of intersectedPairs) {
        set.add(intersectedPair)
      }
    }

    set.delete(pair)

    resultMap.set(pair, set)
  }

  return resultMap
}

const createState = (fragment: Fragment): MatcherPluginState => {
  const dom = serializer.serializeFragment(fragment)
  const pairs = create(dom)(persons)
  return {
    dom,
    pairs,
    history: PersonLinksHistory.create(dom, pairs, createIntersectionMap(pairs)),
  }
}
