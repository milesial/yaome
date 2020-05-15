const api = require('./api')
const logger = require('./logger')
const options = require('./options')
const cors = require('cors')

module.exports = app => {
  logger.info('Starting backend and exposing API')
  app.disable('x-powered-by')
  app.use(cors({
    origin: options.FRONT_URL,
    credentials: true,
    preflightContinue: false
  }))
  app.options('*', cors())
  app.use('/', api)
}
