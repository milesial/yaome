const configure = require('./server/configure')
const logger = require('./server/logger')
const express = require('express')
const { port } = require('./server/options')

let app = express()
configure(app)
app.use('/', express.static('./client/dist'))
app.listen(port, () => logger.info(`App listening at http://localhost:${port}`))

