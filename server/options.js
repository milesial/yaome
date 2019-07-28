const fs = require('fs'),
configPath = './config.json';
module.exports = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
