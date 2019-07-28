const crypto = require('crypto')
const fse = require('fs-extra')
const bcrypt = require('bcrypt')
const db = require('./db.js')

module.exports = {
  initUser: function() {
    return createUserEntry()
      .then(id => createUserDirectory(id))
  },
  registerUser: function(userId, username, password) {
    return bcrypt.hash(password, 10)
      .then(hash => createLoginEntry(userId, username, hash))
  },
  deleteUser: function(userId) {
    return deleteLoginEntry(userId)
      .then(() => deleteUserEntry(userId))
      .then(() => deleteUserDirectory(userId))
  }
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
    fse.mkdir(`./files/${userId}`, { recursive: true })
      .then(() => resolve(userId))
      .catch(err => reject(err))
  })
}

function createLoginEntry(userId, username, hash) {
  return db.query('INSERT INTO logins VALUES($1, $2, $3)', [userId, username, hash])
}

function deleteUserDirectory(userId) {
    return fse.remove(getUserDirectory(userId))
}

function deleteLoginEntry(userId) {
  return db.query('DELETE FROM logins WHERE id = $1', [userId])
}

function deleteUserEntry(userId) {
  return db.query('DELETE FROM users WHERE id = $1', [userId])
}

function getUserDirectory(userId) {
  return `./files/${userId}`
}
