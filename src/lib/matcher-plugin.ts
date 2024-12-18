import {create} from "../index";
import {Plugin, PluginKey} from "prosemirror-state";
import {PersonRangePair} from "./search-person";
import {serializer} from "./schema";
import persons from '../assets/persons.json'

export const matcherPluginKey = new PluginKey<PersonRangePair[]>('matcher-plugin')

export const matcherPlugin = new Plugin<PersonRangePair[]>({
  key: matcherPluginKey,
  state: {
    init: (_, editorState) => {
      const domFragment = serializer.serializeFragment(editorState.doc.content)
      const result = create(domFragment)(persons)

      return result
    },
    apply: (t) => {
      const domFragment = serializer.serializeFragment(t.doc.content)
      const result = create(domFragment)(persons)
      return result
    }
  }
})


