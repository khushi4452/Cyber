const os = require('os');
const { exec } = require('child_process');

// Get OS Info
function getOSInfo() {
  return {
    type: os.type(),
    platform: os.platform(),
    release: os.release(),
  };
}

// Check if antivirus is running (any product)
function checkAntivirus(callback) {
  const psCommand = 'powershell "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct | Select-Object displayName,productState"';

  exec(psCommand, (err, stdout, stderr) => {
    if (err || stderr || !stdout) {
      return callback({ isAntivirusRunning: false, productName: null });
    }

    const lines = stdout.trim().split('\n').filter(line => line && !line.includes('displayName'));
    
    if (lines.length === 0) {
      return callback({ isAntivirusRunning: false, productName: null });
    }

    // Pick the first AV found
    const firstLine = lines[0].trim();
    const productName = firstLine.split(/\s{2,}/)[0]; // assumes 2+ spaces between columns

    callback({ isAntivirusRunning: true, productName });
  });
}

module.exports = {
  getOSInfo,
  checkAntivirus
};
