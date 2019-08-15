const crypto = require('crypto')
const fse = require('fs-extra')
const bcrypt = require('bcrypt')
const db = require('./db.js')

module.exports = {
  initUser: function() {
    return createUserEntry()
      .then(id => createUserDirectory(id))
  },
  registerUser: function(userId, email, password) {
    return bcrypt.hash(password, 10)
      .then(hash => createEmailLoginEntry(userId, email, hash))
  },
  deleteUser: function(userId) {
      return deleteLoginEntry(userId) //TODO revoke oauth
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

function createEmailLoginEntry(userId, email, hash) {
  return db.query('INSERT INTO email_logins VALUES($1, $2, $3, $4)', [userId, email, hash, new Date()])
}

function createProviderLoginEntry(userId, provider_id, name, provider) {
  return db.query('INSERT INTO social_logins VALUES($1, $2, $3, $4, $5)', [userId, provider, provider_id, name, new Date()])
}

function deleteUserDirectory(userId) {
    return fse.remove(getUserDirectory(userId))
}

function deleteLoginEntry(userId) {
    return Promise.all([
        db.query('DELETE FROM email_logins WHERE id = $1', [userId]),
        db.query('DELETE FROM social_logins WHERE id = $1', [userId])
    ])
}

function deleteUserEntry(userId) {
  return db.query('DELETE FROM users WHERE id = $1', [userId])
}

function getUserDirectory(userId) {
  return `./files/${userId}`
}
