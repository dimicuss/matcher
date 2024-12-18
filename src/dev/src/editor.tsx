import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser} from "prosemirror-model"
import {useEffect, useRef} from "react"
import styled from "styled-components"
import {schema} from "lib/schema"
import {plugins} from "lib/plugins"

export const Editor = () => {
  const ref = useRef<HTMLDivElement>(null)
  const initialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && initialRef.current) {
      new EditorView(ref.current, {
        state: EditorState.create({
          doc: DOMParser.fromSchema(schema).parse(initialRef.current),
          plugins
        })
      })
    }
  }, [])


  return (
    <Container>
      <Left>
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
      </Left>
      <Right>

      </Right>
    </Container>
  )
}


const Container = styled.div`
  display: grid;
  grid-template: 'l r' / 1fr 1fr;
`

const Left = styled.div`
  grid-area: l;
`

const Right = styled.div`
  grid-area: r;
`

