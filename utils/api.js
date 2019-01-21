const fs = require('fs')

const rawVerifications = fs.readFileSync('./verifications/verifications.json', 'utf8')
const verifications = JSON.parse(rawVerifications)

function getVerifications() {
    return verifications;
}

module.exports = { getVerifications }