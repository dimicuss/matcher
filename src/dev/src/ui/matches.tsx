import {plugins} from "lib/plugins"
import {schema} from "lib/schema"
import {DOMParser} from "prosemirror-model"
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import ReactJson from "react-json-view"
import styled from "styled-components"
import {MatcherPluginState} from "types"


export const Matches = ({matcherState, view}: Props) => {
  const {matches, history} = matcherState

  return (
    <Container>
      {
        matches.map((pair, i) => {
          const [person, range] = pair
          const handleClick = () => {
            const doc = DOMParser.fromSchema(schema).parse(history.toggle(pair).dom)
            const size = view.state.doc.content.size
            view.dispatch(
              view.state.tr.replaceWith(0, size, doc)
            )
          }

          return (
            <Match key={i} data-enabled={history.pairs.has(pair)}>
              <ReactJson src={person} name="person" />
              <ReactJson src={range} name="range" />
              <Button onClick={handleClick}>Accept</Button>
            </Match>
          )
        })
      }
    </Container>
  )
}

interface Props {
  view: EditorView
  matcherState: MatcherPluginState
}

const Container = styled.div`
  display: grid;
  grid-auto-rows: auto;
`

const Match = styled.div`
  & + & {
    border-top: 1px solid gray;
    padding-top: 10px;
    margin-top: 10px;
  }

  &[data-enabled="true"] {
    background-color: #A1E8A1;
  }
`

const Button = styled.button`
  margin-top: 10px;
`
