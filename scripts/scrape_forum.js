const crawler = require('../utils/crawler')
const fs = require('fs')

crawler.getVerificationsFromWebsite()
  .then( verifications => {
      fs.writeFile('verifications/verifications.json', JSON.stringify(verifications), 'utf8', () => console.log('Verifications had been stored in disk'));
  })