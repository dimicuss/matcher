import {Plugin, PluginKey} from "prosemirror-state";
import {serializer} from "lib/schema";
import persons from 'assets/persons.json'
import {MatcherPluginState} from "types";
import {create} from "../index";

export const matcherPluginKey = new PluginKey<MatcherPluginState>('matcher-plugin')

export const matcherPlugin = new Plugin<MatcherPluginState>({
  key: matcherPluginKey,
  state: {
    init: (_, editorState) => {
      const dom = serializer.serializeFragment(editorState.doc.content)
      const matches = create(dom)(persons)
      return {
        dom,
        matches
      }
    },
    apply: (t) => {
      const dom = serializer.serializeFragment(t.doc.content)
      const matches = create(dom)(persons)
      return {
        dom,
        matches
      }
    }
  }
})


