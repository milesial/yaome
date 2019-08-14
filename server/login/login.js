const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../db.js')

let router = express.Router()

router.use(express.json(), (req, res, next) => {
  if (!req.body.email || !req.body.password)
    throw 'Please provide an email and a password'

    db.query('SELECT id, name, password FROM email_logins WHERE email = $1', [req.body.email])
      .then((res) => {
        if (res.rowCount == 0)
          throw 'Wrong email or password'

        let row = res.rows[0]
        bcrypt.compare(req.body.password, row.password)
          .then(res => {
            if (res) {
              req.session.id = row.id
              res.end(row.name)
            } else {
              throw 'Wrong email or password'    
            }
          })
          .catch(next)
      })
      .catch(next)
})

module.exports = router
