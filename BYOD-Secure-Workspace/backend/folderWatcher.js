// 📂 folderWatcher.js
const chokidar = require('chokidar');
const path = require('path');

const SECURE_FOLDER = path.resolve('C:/CyberSecure_Workspace');

// Watch the secure folder
const watcher = chokidar.watch(SECURE_FOLDER, {
  persistent: true,
  ignoreInitial: false,
  depth: 1,
});

let warningIssued = false;
let wipeTriggered = false;

function issueWarning() {
  warningIssued = true;
  // trigger your front-end status via DB or global variable
  console.log('⚠️ Suspicious activity detected — removal/move detected.');
}

function triggerWipe() {
  wipeTriggered = true;
  // implement secure wipe of secure folder
  console.log('🔥 Wipe triggered — all files will be deleted.');
}

// Listen for new file additions — this is OK
watcher.on('add', (filePath) => {
  console.log(`File added into workspace: ${filePath}`);
  // ✅ Do not issue warnings here
});

// Listen for file removal — suspicious
watcher.on('unlink', (filePath) => {
  if (!warningIssued) {
    issueWarning();
    setTimeout(() => {
      if (warningIssued && !wipeTriggered) {
        triggerWipe();
      }
    }, 10000); // 10s delay
  }
});

// Listen for file renamed or moved outside
watcher.on('rename', (filePath) => {
  issueWarning();
});

