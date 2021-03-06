const express = require('express')
const next = require('next')
const api = require('./utils/api')
const crawler = require('./utils/crawler')


const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
  
    server.get('/', (req, res) => {
      const verifications = api.getVerifications()
      app.render(req, res, '/', { 
        verifications, 
        originURL: crawler.ARAGON_FORUM_URL
      })
    })
      
    server.get('*', (req, res) => {
      return handle(req, res)
    })
  
    server.listen(8080, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:8080')
    })
  })