const api = require('./api')

module.exports = app => {
  app.disable('x-powered-by')
  app.use((req, res, next) => {
    // TODO: do not accept all
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
    res.set('Access-Control-Allow-Methods', 'POST, GET')
    next()
  })
  app.use('/', api)
}
