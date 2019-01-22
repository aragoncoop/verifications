import React from 'react'
import styled from 'styled-components'
import fetch from 'isomorphic-unfetch'

const verify = require('keybase-verify')

const Title = styled.h1`
  font-size: 4em;
  text-align: center;
  margin:20px;
`

const styleAragonApp = (AragonApp) => styled(AragonApp)`
  margin: 50px;
  padding: 40px;
  text-align: center;
`

const styleCard = (Card) => styled(Card)`
  padding: 40px;
  height: auto;
  text-align: center;
  display: inline-block;
  margin: 10px;
`

const styleButton = (Button) => styled(Button)`
  margin: 10px;
`

class DynamicButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: 'Verify signature',
      mode: 'strong',
      emphasis: null
    }
    this.updateMessage = this.updateMessage.bind(this)
    this.completedHandler = this.completedHandler.bind(this)
  }

  updateMessage() {
    this.setState({ message: 'Loading...' })
  }

  completedHandler(message) {
    this.setState({ message: message.content, emphasis: message.success ? 'positive' : 'negative' })
  }

  render() {
    const { Button, triggerHandler } = this.props;
    const { message, mode, emphasis } = this.state;
    return( 
      <Button mode={mode} emphasis={emphasis}
        onClick={() => {
          this.updateMessage()
          triggerHandler(this.completedHandler)
        }}
      >
        { message }
      </Button>
    )
  }
}

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
        Text: module.Text,
        Button: module.Button,
        SafeLink: module.SafeLink
      }))
  }

  // We assume username is in the form @username
  retrievePublicKeyFromKeybase = async (username) => username && await fetch(`https://keybase.io/${username}/pgp_keys.asc`).then( res => res.text() )
  retrieveUsernameFromBody = (verification) => (match => match && match[0])(verification.body ? verification.body.match(/\B@\w+/g) : '')
  verifySignatureWithPublicKey = async (username, signedMessage) => {
    const publicKey = await this.retrievePublicKeyFromKeybase(username)
    try { 
      const isValid = await verify(publicKey, signedMessage);
      return isValid ? 
        { content: `Valid signature by Keybase user @${username}`, success: true, updated: true } : 
        { content: `Invalid signature. Not signed by @${username}`, success: false, updated: true }
    } catch(err) {
      return { content: err.message, success: false }
    }
  }

  render() {
    const { AragonApp, Card, Button, SafeLink } = this.state; 
    const { verifications, originURL } = this.props;
    const StyledAragonApp = AragonApp && styleAragonApp(AragonApp)
    const StyledCard = Card && styleCard(Card)
    const StyledButton = Button && styleButton(Button)
    
    return (
      <div>
        {
          AragonApp && 
            <StyledAragonApp publicUrl="/public/">
              <Title>Aragon Verifications</Title>
              { 
                verifications.map( verification => {
                    const atUsername = this.retrieveUsernameFromBody(verification)
                    const username = atUsername && atUsername.substring(1)
                    return(
                      verification.body && username && <StyledCard key={ username }>
                        <img src={`${originURL}${verification.avatar}`}/>
                        <h2><SafeLink target="_blank" href={`https://keybase.io/${username}`}>{username}</SafeLink></h2>
                        <StyledButton mode="outline" onClick={() => alert(verification.body)}>See signature</StyledButton>
                        <DynamicButton
                           Button={Button}
                           triggerHandler={
                             async (completedCallback) => {
                              const message = await this.verifySignatureWithPublicKey(username, verification.body)
                              completedCallback(message);
                             }
                           }
                        />
                      </StyledCard>
                    )
                  }
                )
              }
            </StyledAragonApp>
        }
      </div>
    )
  }
} 
  
export default Index;
