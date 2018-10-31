const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();

exports.log = (data) => {
  if (currentWindow.webContents.isDevToolsOpened()) {
    console.log(data);
  }
}
