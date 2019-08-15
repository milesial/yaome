const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../db.js')

let router = express.Router()

router.use(express.json(), (req, res, next) => {
  if (req.session.logged)
    return next()

  if (!req.body.email || !req.body.password)
    throw 'Please provide an email and a password'

    db.query('SELECT id, password FROM email_logins WHERE email = $1', [req.body.email])
      .then((r) => {
        if (r.rowCount == 0)
          throw 'Wrong email or password'

        let row = r.rows[0]
        bcrypt.compare(req.body.password, row.password)
          .then(r => {
            if (r) {
              // TODO delete anonymous user created ?
              req.session.id = row.id
              req.session.logged = true
              res.cookie('logged', 'true')
              res.cookie('name', req.body.email.split('@')[0])
              res.end('')
            } else {
              throw 'Wrong email or password'    
            }
          })
          .catch(next)
      })
      .catch(next)
})

module.exports = router
