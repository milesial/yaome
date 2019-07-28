const crypto = require('crypto')
const fs = require('fs')
const bcrypt = require('bcrypt')
const util = require('util')
const db = require('./db.js')

const mkdir = util.promisify(fs.mkdir)

module.exports = {
  initNewUser: function() {
    return createUserEntry()
      .then(id => createUserDirectory(id))
  },
  registerUser: function(userId, username, password) {
    return bcrypt.hash(password, 10)
      .then(hash => createLoginEntry(userId, username, hash))
  },
}

function createUserEntry() {
  return new Promise((resolve, reject) => {
    let id = crypto.randomBytes(16).toString("hex")
    let now = new Date()
    db.query('INSERT INTO users VALUES ($1, $2, $3)', [id, now, now])
      .then(() => resolve(id))
      .catch(err => reject(err))
  })
}

function createUserDirectory(userId) {
  return new Promise((resolve, reject) => {
    mkdir(`./files/${userId}`, { recursive: true })
      .then(() => resolve(userId))
      .catch(err => reject(err))
  })
}

function createLoginEntry(userId, username, hash) {
  return db.query('INSERT INTO logins VALUES($1, $2, $3)', [userId, username, hash])
}

function deleteUserDirectory(userId) {

}

function deleteUserEntry(userId) {
  db.query('DELETE FROM users WHERE id = $1', [id])
}
