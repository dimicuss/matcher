import {DOMOutputSpec, DOMSerializer, Mark, Node, Schema} from "prosemirror-model"
import {schema as basicSchema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"


export const schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
  marks: basicSchema.spec.marks
})

const nodes: {[node: string]: (node: Node) => DOMOutputSpec} = {}
const marks: {[mark: string]: (node: Mark, inline: boolean) => DOMOutputSpec} = {}

schema.spec.nodes.forEach((nodeName, {toDOM}) => {
  nodes[nodeName] = toDOM || (({text}) => text || '')
})

schema.spec.marks.forEach((markName, {toDOM}) => {
  marks[markName] = toDOM || (() => '')
})

export const serializer = new DOMSerializer(nodes, marks)
