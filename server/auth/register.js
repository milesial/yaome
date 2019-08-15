const express = require('express')
const db = require('../db.js')
const { registerUser } = require('../user-utils.js')

let router = express.Router()

router.use(express.json(), (req, res, next) => {
  if (req.session.logged)
    return next()

  if (!req.body.email || !req.body.password)
    throw 'Please provide an email and a password'

  if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email))
    throw 'Incorrect email'

  if (req.body.password.length < 8)
    throw 'Password must have 8 characters or more'

  db.query('SELECT id FROM email_logins WHERE id = $1', [req.session.id])
    .then((r) => {
      if (r.rowCount > 0)
        throw 'You are already registered'
    
      db.query('SELECT id FROM email_logins WHERE email = $1', [req.body.email])
        .then((r) => {
          if (r.rowCount > 0)
            throw 'Email is already registered'

          registerUser(req.session.id, req.body.email, req.body.password)
            .then(() => {
              req.session.logged = true
              res.cookie('logged', 'true')
              res.cookie('name', req.body.email.split('@')[0])
              res.end('')
            })
            .catch(next)
        })
        .catch(next)
    })
    .catch(next)
})

module.exports = router
