import {Plugin, PluginKey} from "prosemirror-state";
import {serializer} from "lib/schema";
import persons from 'assets/persons.json'
import {MatcherPluginState} from "types";
import {create} from "../index";
import {Fragment} from "prosemirror-model";
import {PersonLinksHistory} from "./person-links-history";

export const matcherPluginKey = new PluginKey<MatcherPluginState>('matcher-plugin')

export const matcherPlugin = new Plugin<MatcherPluginState>({
  key: matcherPluginKey,
  state: {
    init: (_, editorState) => {
      console.log(editorState)
      return createState(editorState.doc.content)
    },
    apply: (t, value) => t.docChanged ? createState(t.doc.content) : value
  }
})


const createState = (fragment: Fragment) => {
  const dom = serializer.serializeFragment(fragment)
  const matches = create(dom)(persons)

  return {
    dom,
    matches,
    history: PersonLinksHistory.create(dom, matches)
  }
}
