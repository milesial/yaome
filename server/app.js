const express = require('express')
const sessions = require('client-sessions')
const fs = require('fs')
const { exec } = require('child_process')
const options = require('./options')
const { initNewUser, registerUser } = require('./user-utils.js')

const app = express()

app.disable('x-powered-by')
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

app.use(['/edit', '/register'], (req, res, next) => {
  if (req.session.id) {
    res.set('X-Seen-You', 'true');
    next()
  } else {
    // creation of a new user
    res.set('X-Seen-You', 'false');
    initNewUser()
      .then((id) => {
        console.log('Created new user', id)
        req.session.id = id
      })
      .catch(err => {
        console.error(err.stack)
        res.status(500).send('Error initializing the new user')
      })
      .finally(next)
  }
});

// ------- Registration -------
app.get('/register', function(req, res) {
  res.sendFile('register.html', { root: '.' })
})

app.post('/register', express.urlencoded({ extended: false }), function(req, res) {
  registerUser(req.session.id, req.body.username, req.body.password)
    .then(() => console.log('Registered user', req.body.username))
})

app.post('/render/:output', express.json(), (req, res) => {
  let format = req.params['output']
  if (!['html', 'pdf'].includes(format)) {
    res.status(400).send(`Unknown output format: ${format}`)
    return
  }
  let md = req.body['markdown']
  if (format == 'pdf') {
    exec(`printf '%s\n' '${md}' | pandoc --mathjax -f markdown -t latex -o /tmp/out.pdf`, (err, stdout, stderr) => {
      if (err)
        res.set('content-type', 'application/json').status(500).send(err)
      else
        res.sendFile('out.pdf', { root: '/tmp/' })
    })
  } else if (format == 'html') {
    exec(`printf '%s\n' '${md}' | pandoc --mathjax -f markdown -t html`, (err, stdout, stderr) => {
      if (err)
        res.set('content-type', 'application/json').status(500).send(err)
      else
        res.set('content-type', 'text/html').send(stdout)
    })
  }
})

app.listen(options.port, () => console.log(`App listening on port ${options.port}`))
