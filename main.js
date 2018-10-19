const { app } = require('electron');
const mainWindow = require('./main.window');
const argsParser = require("args-parser");

const args = argsParser(process.argv);

if (args.dev){
  require('electron-reload')(__dirname)
}

process.on('uncaughtException', function (e, x) {
  console.log('uncaughtException', e, x);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    mainWindow.create();
  }
});

app.once('ready', () => {
  mainWindow.create();
});
