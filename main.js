const { app } = require('electron');
const mainWindow = require('./app/main.window');

process.on('uncaughtException', function (e) {
  console.log('uncaughtException', e);
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