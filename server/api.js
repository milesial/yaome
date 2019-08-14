const express = require('express')
const sessions = require('client-sessions')
const { exec } = require('child_process')
const options = require('./options')
const crypto = require('crypto')
const request = require('request')
const { initUser, registerUser, deleteUser } = require('./user-utils.js')
const { getFileHierarchy, createFile, createDirectory, deleteFileOrDir } = require('./files.js')
const oauth = require('./login/oauth.js')
const login = require('./login/login.js')

let router = express.Router()

router.use(sessions({
  cookieName: 'session',
  secret: options.secret,
  duration: 7 * 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}))

// creation of a new user (visitor) if needed
router.use((req, res, next) => {
  if (req.session.id) {
    res.set('X-Seen-You', 'true')
    return next()
  } 
  res.set('X-Seen-You', 'false')
  initUser()
    .then(id => {
      console.log('Created new user', id)
      req.session.id = id
      next()
    })
})

// creation of a login linked to the user
router.post('/user', express.urlencoded({ extended: false }), function(req, res, next) {
  registerUser(req.session.id, req.body.username, req.body.password)
    .then(() => {
      console.log('Registered user', req.body.username)
      next()
    })
})

// removal of the user + login
router.delete('/user', function(req, res, next) {
  deleteUser(req.session.id)
    .then(() => {
      console.log('Deleted user', req.session.id)
      delete req.session.id
      next()
    })
})

// checks on the render format requested
router.use('/render/:output', (req, res, next) => {
  let format = req.params.output
  if (!['html', 'pdf'].includes(format))
    return next(`Unknown output format: ${format}`)

  next()
})

// actual rendering using pandoc
router.post('/render/:output', express.json(), (req, res, next) => {
  let format = req.params.output
  let md = req.body.markdown

  let options = ['--mathjax']
  if (req.body.download) {
    options.push('-s')
    res.set('Content-Disposition', `attachment; filename="${req.body.file}.${format}"`)
  }

  let suffix = ''
  if (format == 'pdf')
    suffix = `-t latex -o ./server/render/${req.session.id}.pdf`
  else if (format == 'html')
    suffix = '-t html'

  exec(`printf '%s\n' '${md}' | pandoc ${options.join(" ")} -f markdown ${suffix}`, (err, stdout, stderr) => {
    if (err)
      next(err)
    else if (format == 'pdf')
      res.sendFile(`${req.session.id}.pdf`, { root: './server/render/' })
    else if (format == 'html')
      res.set('content-type', 'text/html').send(stdout)
  })
})

// get the user's files in a tree structure (json)
router.get('/files', (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')

  res.send(getFileHierarchy(req.session.id))
  next()
})

// create a file or a directory
router.post('/files', express.urlencoded({ extended: false }), (req, res, next) => {
  if (!req.body.name || !req.body.type)
    return next('Need a name and a type')

  if (!['directory', 'file'].contains(req.body.type))
    return next('Type must be a file or a directory')

  let path = req.body.name.replace('../', '')
  if (req.body.type == 'file') {
    createFile(path)
      .catch(next)
      .then(() => res.end())
  } else {
    createDirectory(path)
      .catch(next)
      .then(() => res.end())
  }
})

// delete a file or a directory
router.delete('/files', express.urlencoded({ extended: false }), (req, res, next) => {
  if (!req.body.name)
    next('Need a name')

  let path = req.body.name.replace('../', '')
  deleteFileOrDir(path)
    .catch(next)
    .then(() => res.end())
})

// oauth callback
router.get('/oauth', oauth)
router.post('/login', login)

// error handling
router.use((err, req, res, next) => {
  console.log(err)
  next(err)
})

router.use((err, req, res, next) => {
  if (req.xhr)
    res.status(500).send({ error: err.toString() })
  else
    next(err)
})

router.use((err, req, res, next) => {
  res.status(500).json({ error: err.toString() })
})

module.exports = router
