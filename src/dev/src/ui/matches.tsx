import {PersonLinksHistory} from "lib/person-links-history"
import {useState} from "react"
import ReactJson from "react-json-view"
import styled from "styled-components"
import {MatcherPluginState} from "types"


export const Matches = ({matcherState}: Props) => {
  const {dom, matches} = matcherState
  const [pairs, setPairs] = useState(() => PersonLinksHistory.create(dom, matches))

  return (
    <Container>
      {
        matches.map((pair, i) => {
          const [person, range] = pair
          const handleClick = () => {
            setPairs(pairs.toggle(pair))
          }

          return (
            <Match key={i} data-enabled={pairs.pairs.has(pair)}>
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
