const fse = require('fs-extra')
const dirTree = require("directory-tree")

module.exports = {
  createFile: (userId, name) => fse.createFile(`./files/${userId}/${name}`),
  deleteFileOrDir: (userId, name) => fse.remove(`./files/${userId}/${name}`),
  getFileHierarchy: (userId) => dirTree(`./files/${userId}`, { attributes: ['name', 'path'] }),
  createDirectory: (userId, name) => mkdirs(`./files/${userId}/${name}`),
}
