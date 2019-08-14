const fs = require('fs')
const configPath = './server/config.json'
module.exports = JSON.parse(fs.readFileSync(configPath, 'UTF-8'))
