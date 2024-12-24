import {getNode} from "lib/get-node"
import {matcherPluginKey} from "lib/matcher-plugin"
import {EditorState} from "prosemirror-state"
import {useEffect, useState} from "react"
import ReactJson from "react-json-view"
import styled from "styled-components"
import {Range} from "types"

export const Matches = ({state}: Props) => {
  const [ranges, setRanges] = useState(new Set<Range>())
  const matcherState = matcherPluginKey.getState(state)
  const matches = matcherState?.matches || []
  const domToEdit = matcherState?.dom

  useEffect(() => {
    setRanges(new Set)
  }, [matches])

  useEffect(() => {
    if (domToEdit) {
      for (const range of ranges) {
        console.log(
          getNode(domToEdit, range.path)
        )
      }
    }
  }, [ranges, domToEdit])

  return (
    <Container>
      {
        matches.map(([person, range], i) => {
          const handleClick = () => {
            if (ranges.has(range)) {
              const newRanges = new Set(ranges)
              newRanges.delete(range)
              setRanges(newRanges)
            } else {
              const newRanges = new Set(ranges)
              newRanges.add(range)
              setRanges(newRanges)
            }
          }

          return (
            <Match key={i} data-enabled={ranges.has(range)}>
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

  &[data-enabled="true"] {
    background-color: #A1E8A1;
  }
`


const Button = styled.button`
  margin-top: 10px;
`
