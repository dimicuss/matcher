import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"
import {useEffect, useRef} from "react"

export const Editor = () => {
  const ref = useRef<HTMLDivElement>(null)
  const initialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
      marks: schema.spec.marks
    })

    if (ref.current && initialRef.current) {
      new EditorView(ref.current, {
        state: EditorState.create({
          doc: DOMParser.fromSchema(mySchema).parse(initialRef.current),
          plugins: exampleSetup({schema: mySchema})
        })
      })
    }
  }, [])


  return (
    <>
      <div ref={ref}></div>
      <div ref={initialRef} style={{display: 'none'}}>
        <h3>
          Hello ProseMirror
        </h3>
        <p>
          This is editable text. You can focus it and start typing.</p>
        <p>
          To apply styling, you can select a piece of text and manipulate
          its styling from the menu. The basic schema
          supports <em>emphasis</em>, <strong>strong text</strong>,
          <a href="http://marijnhaverbeke.nl/blog">links</a>, <code>code font</code>.
        </p>
        <p>
          Block-level structure can be manipulated with key bindings (try
          ctrl-shift-2 to create a level 2 heading, or enter in an empty
          textblock to exit the parent block), or through the menu.
        </p>
        <p>
          Try using the “list” item in the menu to wrap this paragraph in
          a numbered list.
        </p>
      </div>
    </>
  )
}
