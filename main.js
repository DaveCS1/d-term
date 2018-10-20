const { app } = require('electron');
const mainWindow = require('./main.window');

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
