const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();

exports.log = (data) => {
  if (currentWindow.webContents.isDevToolsOpened()) {
    if (Array.isArray(data)) {
      console.log(data[0], data.slice(1));
      return;
    }
    console.log(data);
  }
}
