const express = require('express')
const sessions = require('client-sessions')
const { spawn } = require('child_process')
const options = require('./options')
const { initUser, registerUser, deleteUser } = require('./user-utils.js')
const { getPath, getFileHierarchy, pathExists, createFile, importFile, createDirectory, deleteFileOrDir } = require('./files.js')
const oauth = require('./auth/oauth.js')
const login = require('./auth/login.js')
const register = require('./auth/register.js')
const logout = require('./auth/logout.js')
const path = require('path')
const multer = require('multer')
const archiver = require('archiver')
const fs = require('fs')

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
  if (!req.params.output)
    next('Need an output parameter')

  let format = req.params.output
  if (!['html', 'pdf'].includes(format))
    return next(`Unknown output format: ${format}`)

  next()
})

// save to file
router.use('/render/:output', express.json(), (req, res, next) => {
  if (!req.body.file)
    next('Need a file parameter')

  // write file but don't wait for callback
  fs.writeFile(getPath(req.session.id, req.body.file), req.body.markdown, () => {})
  next()
})

// actual rendering using pandoc
router.post('/render/:output', (req, res, next) => {
  let format = req.params.output
  let md = req.body.markdown

  let options = ['--mathjax']
  if (req.body.download) {
    options.push('-s')
    res.set('Content-Disposition', `attachment; filename="${req.body.file}.${format}"`)
  }

  if (format == 'pdf') {
    options.push('--to=latex')
    options.push(`--output=./server/render/${req.session.id}.pdf`)
  }
  else if (format == 'html') {
    options.push('--mathjax')
    options.push('--to=html')
  }

  let child = spawn('pandoc', options)

  if (format == 'pdf') {
    child.on('exit', code => {
      if (!code)
        res.sendFile(`${req.session.id}.pdf`, { root: './server/render/' })
    })
  } else if (format == 'html') {
    let runningBuffer = ''
    child.stdout.on('data', (data) => {
      runningBuffer += data.toString()
    })

    child.stdout.on('end', () => {
      if (runningBuffer != '')
        res.set('content-type', 'text/html').send(runningBuffer)
    })
  }

  let stderr = ''
  child.stderr.on('data', (data) => {
    stderr += data.toString()
  })
  child.stderr.on('end', () => {
    if (stderr != '') {
      next(stderr)
    }
  })

  child.stdin.end(md)
})

router.get('/files/:path', (req, res, next) => {
  pathExists(req.session.id, req.params.path)
    .then(exists => {
      if (!exists)
        throw 'Path does not exist'

      fs.readFile(getPath(req.session.id, req.params.path), (err, data) => {
        if (err)
          throw err

        res.set('content-type', 'test/plain').send(data)
      })
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

router.get('/zip', (req, res, next) => {
  const archive = archiver('zip', { zlib: { level: 9 }})
  const stream = fs.createWriteStream(`./server/zips/${req.session.id}.zip`)

  archive
    .directory(`./files/${req.session.id}`, false)
    .on('error', err => next(err))
    .pipe(stream)

  stream.on('close', () => res.download(`./server/zips/${req.session.id}.zip`, 'notes.zip'))
  archive.finalize()
})

// create a file or a directory
router.post('/files', express.json(), multer().array('files'), (req, res, next) => {
  // files upload handled by multer (multipart form data)
  if (req.files) {
    return createDirectory(req.session.id, req.body.path)
      .then(() => Promise.all(req.files.map(f => importFile(
	req.session.id, path.join(req.body.path, f.originalname), f.buffer)
      )))
      .then(() => res.end())
      .catch(next)
  }

  // empty file / dir creation
  if (!req.body.path || !req.body.type)
    return next('Need a path and a type')

  if (!['directory', 'file'].includes(req.body.type))
    return next('Type must be a file or a directory')

  pathExists(req.session.id, req.body.path)
    .then(exists => {
      if (exists)
        throw 'Path already exists'

      if (req.body.type == 'file')
        return createFile(req.session.id, req.body.path)
      else
        return createDirectory(req.session.id, req.body.path)
    })
    .then(() => res.end())
    .catch(next)
})

// delete a file or a directory
router.delete('/files', (req, res, next) => {
  if (!req.query.path)
    next('Need a path')

  deleteFileOrDir(req.session.id, req.query.path)
    .catch(next)
    .then(() => res.end())
})

// oauth callback
router.get('/oauth', oauth)
router.post('/login', login)
router.post('/register', register)
router.get('/logout', logout)

// ping
router.get('/status', (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')

  res.send()
  next()
})

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
