import React from 'react'
import styled from 'styled-components'
import fetch from 'isomorphic-unfetch'

const Title = styled.h1`
  font-size: 4em;
  text-align: center;
  margin:20px;
`

const styleAragonApp = (AragonApp) => styled(AragonApp)`
  margin: 50px;
  padding: 40px;
`

const styledCard = (Card) => styled(Card)`
  padding: 40px;
  width: 100%;
  height: auto;
  text-align: center;
`

class Index extends React.Component {
  static async getInitialProps ({ req, query }) {
    const isServer = !!req
    return isServer ? 
      { verifications: query.verifications, originURL: query.originURL } :
      { verifications: await fetch('/api/verifications', {
        headers: { Accept: 'application/json' }
      }).json(), originURL: query.originURL }
  }
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    import('@aragon/ui')
      .then( module => this.setState({ 
        AragonApp: module.AragonApp,
        Card: module.Card,
        Text: module.Text
      }))
  }
  render() {
    const { AragonApp, Card, Text } = this.state; 
    const { verifications, originURL } = this.props;
    const StyledAragonApp = AragonApp && styleAragonApp(AragonApp)
    const StyledCard = Card && styledCard(Card)
    console.log('originURL', originURL)
    return (
      <div>
        {
          AragonApp && 
            <StyledAragonApp publicUrl="/aragon-ui-assets/">
              <Title>Aragon Verifications</Title>
              { 
                verifications.map( verification => 
                  <StyledCard>
                    <img src={`${originURL}${verification.avatar}`}/>
                    <Text>
                      <pre>
                      { verification.body }
                      </pre>
                    </Text>
                  </StyledCard>
                )
              }
            </StyledAragonApp>
        }
      </div>
    )
  }
} 
  
export default Index;