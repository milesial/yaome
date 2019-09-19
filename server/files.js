const fse = require('fs-extra')
const dirTree = require('directory-tree')
const path = require('path')

let sanitize = p => path.normalize(p).replace(/^(\.\.(\/|\\|$))+/, '')
let getPath = (userId, name) => path.join('./files', `${userId}/${sanitize(name)}`)
let removePrefix = (userId, p) => path.relative(getPath(userId, ''), p)

module.exports = {
  pathExists: (userId, name) => fse.pathExists(getPath(userId, name)),
  createFile: (userId, name) => fse.createFile(getPath(userId, name)).then(() => userId),
  importFile: (userId, name, buffer) => fse.createFile(getPath(userId, name)).then(() => fse.writeFile(getPath(userId, name), buffer)),
  deleteFileOrDir: (userId, name) => fse.remove(getPath(userId, name)),
  getFileHierarchy: (userId) => dirTree(getPath(userId, ''), {},
    i => { i.path = removePrefix(userId, i.path) }, // cb for files
    i => { i.path = removePrefix(userId, i.path) }), // cb for dirs
  createDirectory: (userId, name) => fse.mkdirs(getPath(userId, name)),
}
