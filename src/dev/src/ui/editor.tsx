import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {DOMParser} from "prosemirror-model"
import {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {schema} from "lib/schema"
import {plugins} from "lib/plugins"
import {Matches} from "./matches"

export const Editor = () => {
  const [state, setState] = useState<EditorState>()

  const ref = useRef<HTMLDivElement>(null)
  const initialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && initialRef.current) {
      const view = new EditorView(ref.current, {
        state: EditorState.create({
          doc: DOMParser.fromSchema(schema).parse(initialRef.current),
          plugins
        }),
        dispatchTransaction: (t) => {
          view.updateState(view.state.apply(t))
          setState(view.state)
        }
      })

      setState(view.state)
    }
  }, [])

  return (
    <Container>
      <Left>
        <div ref={ref}></div>
        <div ref={initialRef} style={{display: 'none'}}>
          <p>
            Абдалла II
          </p>
          <p>
            Мишустин Михаил
          </p>
          <p>
            Ангела Меркель
          </p>
        </div>
      </Left>
      <Right>
        {state && <Matches state={state} />}
      </Right>
    </Container>
  )
}


const Container = styled.div`  
  display: grid;
  grid-template: 'l r' / 1fr 1fr; 
  gap: 20px;
  height: 100%;
`

const Left = styled.div`
  grid-area: l;
`

const Right = styled.div`
  grid-area: r;
`

