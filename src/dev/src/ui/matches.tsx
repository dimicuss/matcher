import {getNode} from "lib/get-node"
import {matcherPluginKey} from "lib/matcher-plugin"
import {wrap} from "lib/wrap"
import {EditorState} from "prosemirror-state"
import {useEffect, useState} from "react"
import ReactJson from "react-json-view"
import styled from "styled-components"
import {PersonRangePair, Range} from "types"

export const Matches = ({state}: Props) => {
  const [pairs, setOairs] = useState(new Set<PersonRangePair>())
  const matcherState = matcherPluginKey.getState(state)
  const matches = matcherState?.matches || []
  const dom = matcherState?.dom

  useEffect(() => {
    setOairs(new Set)
  }, [matches])

  useEffect(() => {
    if (dom && pairs.size) {
      let resultDom = dom

      for (const [person, range] of pairs) {
        const node = getNode(resultDom, range.path)


        if (node) {
          wrap(resultDom, person, range)
        }
      }

      console.log(dom)
    }
  }, [pairs, dom])

  return (
    <Container>
      {
        matches.map((pair, i) => {
          const [person, range] = pair
          const handleClick = () => {
            if (pairs.has(pair)) {
              const newRanges = new Set(pairs)
              newRanges.delete(pair)
              setOairs(newRanges)
            } else {
              const newRanges = new Set(pairs)
              newRanges.add(pair)
              setOairs(newRanges)
            }
          }

          return (
            <Match key={i} data-enabled={pairs.has(pair)}>
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
