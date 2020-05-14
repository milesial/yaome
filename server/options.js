const fs = require('fs')
const configPath = './server/config.json'
let config = JSON.parse(fs.readFileSync(configPath, 'UTF-8'))
config.FRONT_URL = process.env.FRONT_URL ? process.env.FRONT_URL : 'http://localhost:1024'
module.exports = config
