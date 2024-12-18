import {exampleSetup} from "prosemirror-example-setup"
import {schema} from "./schema"
import {matcherPlugin} from "./matcher-plugin"

export const plugins = [
  ...exampleSetup({schema}),
  matcherPlugin
]
