const express = require('express')

let router = express.Router()

router.use(express.json(), (req, res, next) => {
  req.session.logged = false
  res.clearCookie('logged', { path: '/' })
  res.clearCookie('name', { path: '/' })
  req.session.destroy()
  res.redirect('http://localhost:8080')
})

module.exports = router
