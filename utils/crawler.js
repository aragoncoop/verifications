const Nightmare = require('nightmare')

function Crawler() {
    this.ARAGON_FORUM_URL = 'https://forum.aragon.org'
    this.ARAGON_COOPERATIVE_MEMBERSHIP_THREAD = `${this.ARAGON_FORUM_URL}/t/aragon-cooperative-membership-thread/463`
    
    this.nightmare = Nightmare({ show: false })

    this.getPublicKeyFromKeybase = (username) => {
        return this.nightmare
          .goto(this.KEYBASE_PUBLIC_KEYS_URL(username))
          .evaluate(
            selector => {
              const publicKey = (key = key && key.textContent)(document.querySelector(selector))
              return { publicKey }
            }, 
            'body pre'
          )
    }

    this.getVerificationsWithPublicKey = function(verifications) {
      return verifications.map( verification => 
        this.getPublicKeyFromKeybase(verification.username)
        .then( publicKey => Object.assign({}, verification, publicKey ))
      )
    }

    this.getVerificationsFromWebsite = () => {
        return this.nightmare
          .goto(this.ARAGON_COOPERATIVE_MEMBERSHIP_THREAD)
          .evaluate(
            selector => {
              const posts = document.querySelectorAll(selector)
              return Array.prototype.map.call(posts, (post => {
                const avatar = (img => img && img.getAttribute('src'))(post.querySelector('.topic-avatar img'))
                const body = (code => code && code.textContent)(post.querySelector('.topic-body code'))
                return { avatar, body }
              })).filter( verification => !!verification.body )
            }, 
            '.topic-post'
          )
      }
}

module.exports = new Crawler();