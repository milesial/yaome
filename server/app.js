const express = require('express')
const sessions = require('client-sessions')
const { exec } = require('child_process')
const options = require('./options')
const { initUser, registerUser, deleteUser } = require('./user-utils.js')
const { getFileHierarchy } = require('./files.js')

const app = express()

app.disable('x-powered-by')
// TODO: link with vuecli serve ?
// app.use(express.static('.'))

app.use(sessions({
  cookieName: 'session',
  secret: options.secret,
  duration: 7 * 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}))

app.use((req, res, next) => {
  // TODO: do not accept all
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
  res.set('Access-Control-Allow-Methods', 'POST, GET')
  next()
})

// creation of a new user (visitor) if needed
app.use((req, res, next) => {
  if (req.session.id) {
    res.set('X-Seen-You', 'true')
    return next()
  } 
  res.set('X-Seen-You', 'false')
  initUser()
    .then((id) => {
      console.log('Created new user', id)
      req.session.id = id
    })
    .catch(next)
    .then(() => next())
});

// creation of a login linked to the user
app.post('/user', express.urlencoded({ extended: false }), function(req, res, next) {
  registerUser(req.session.id, req.body.username, req.body.password)
    .then(() => console.log('Registered user', req.body.username))
    .catch(next)
    .then(() => next())
})

// removal of the user + login
app.delete('/user', function(req, res, next) {
  deleteUser(req.session.id)
    .then(() => console.log('Deleted user', req.session.id))
    .catch(next)
  delete req.session.id
  next()
})

// checks on the render format requested
app.use('/render/:output', (req, res, next) => {
  let format = req.params.output
  if (!['html', 'pdf'].includes(format))
    return next(`Unknown output format: ${format}`)

  next()
})

// actual rendering using pandoc
app.post('/render/:output', express.json(), (req, res, next) => {
  let format = req.params.output
  let md = req.body.markdown

  let options = ['--mathjax']
  if (req.body.standalone)
    options.append('-s')

  let suffix = ''
  if (format == 'pdf')
    suffix = `-t latex -o ./render/${req.session.id}.pdf`
  else if (format == 'html')
    suffix = '-t html'

  exec(`printf '%s\n' '${md}' | pandoc ${options.join(" ")} -f markdown ${suffix}`, (err, stdout, stderr) => {
    if (err)
      next(err)
    else if (format == 'pdf')
      res.sendFile(`${req.session.id}.pdf`, { root: './render/' })
    else if (format == 'html')
      res.set('content-type', 'text/html').send(stdout)
  })
  next()
})

// get the user's files in a tree structure (json)
app.get('/tree', (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')

  res.send(getFileHierarchy(req.session.id))
  next()
})

app.listen(options.port, () => console.log(`App listening on port ${options.port}`))
