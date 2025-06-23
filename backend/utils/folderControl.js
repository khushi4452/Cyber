// utils/folderControl.js
const fs = require('fs');
const path = require('path');

const folderPath = 'C:/CyberSecure_Workspace';
const sourceFile = path.join(__dirname, '../data/starter.txt'); // example file
const destFile = path.join(folderPath, 'instructions.txt');

function createSecureFolder(callback) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Copy a sample file into it
  fs.copyFile(sourceFile, destFile, (err) => {
    if (err) return callback(err);
    callback(null);
  });
}

module.exports = {
  createSecureFolder,
  folderPath,
};
