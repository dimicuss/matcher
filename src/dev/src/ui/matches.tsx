import {matcherPluginKey} from "lib/matcher-plugin"
import {EditorState} from "prosemirror-state"
import ReactJson from "react-json-view"
import styled from "styled-components"

export const Matches = ({state}: Props) => {
  const {matches} = matcherPluginKey.getState(state) || {matches: [], dom: undefined}

  return (
    <Container>
      {matches.map(([person, range], i) => (
        <Match key={i}>
          <ReactJson src={person} name="person" />
          <ReactJson src={range} name="range" />
        </Match>
      ))}
    </Container>
  )
}

interface Props {
  state: EditorState
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
`


