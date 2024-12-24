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
        <EditorWrapper>
          <div ref={ref} />
        </EditorWrapper>
        <Bottom>
        </Bottom>
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
  background
`

const Left = styled.div`
  display: grid;
  gap: 20px;
  grid-area: l;
  grid-template: 'a' 1fr 'a' 1fr / 1fr;
  overflow: auto;
`

const Right = styled.div`
  grid-area: r;
  overflow: auto;
`

const EditorWrapper = styled.div`
  overflow: auto;
`

const Bottom = styled.div`
  overflow: auto;
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


