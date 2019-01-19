const express = require('express')
const next = require('next')
const crawler = require('./utils/crawler')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
  
    server.get('/', (req, res) => {
      crawler.getVerificationsFromWebsite()
      .then( verifications => {
        app.render(req, res, '/', { 
          verifications, 
          originURL: crawler.ARAGON_FORUM_URL 
        })
      })
    })

    // Client Side Rendering
    server.get('/api/verifications', (req, res) => {
      crawler.getVerificationsFromWebsite()
      .then( verifications => {
        res.json({ 
          verifications, 
          originURL: crawler.ARAGON_FORUM_URL 
        })
      }) 
    })
      
    server.get('*', (req, res) => {
      return handle(req, res)
    })
  
    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })