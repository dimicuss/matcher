import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {parser} from "lib/schema"
import {plugins} from "lib/plugins"
import {Matches} from "dev/src/ui/matches"

export const Editor = () => {
  const [state, setState] = useState<EditorState>()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const view = new EditorView(ref.current, {
        state: EditorState.create({
          doc: parser.parse(initialState.body.children[0]),
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

const initialState = new DOMParser().parseFromString(`
<div>
  <p>
    Абдалла II
  </p>
  <p>
    Мишустин Михаил
  </p>
  <p>
    Ангела Меркель Олаф Шольц
  </p>
</div>
`, 'text/html')

