const express = require('express')
const options = require('../options')

let router = express.Router()

router.use(express.json(), (req, res, next) => {
  req.session.logged = false
  res.clearCookie('logged', { path: '/' })
  res.clearCookie('name', { path: '/' })
  req.session.destroy()
  res.redirect(options.FRONT_URL)
})

module.exports = router
