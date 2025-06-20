// utils/systemCheck.js
const os = require('os');
const { exec } = require('child_process');

function getOSInfo() {
  return {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
  };
}

function checkAntivirus(callback) {
  exec('powershell "Get-MpComputerStatus | Select-Object -Property AMServiceEnabled"', (error, stdout, stderr) => {
    if (error) {
      callback(false);
    } else {
      const isRunning = stdout.includes('True');
      callback(isRunning);
    }
  });
}

module.exports = {
  getOSInfo,
  checkAntivirus,
};
