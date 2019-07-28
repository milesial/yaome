var glob = require("glob")
const fs = require('fs')

function getFilePath(userId, name) {
  return `./files/${userId}/${name}`
}

function newFile(userId, name) {

}

function getFileHierarchy(userID) {
  glob(`./files/${userId}/**/*`, options, function (er, files) {
    
  })
}

function newDirectoryForUser(userID, next) {

}
