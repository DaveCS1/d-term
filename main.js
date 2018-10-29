const { app, ipcMain } = require('electron');
const mainWindow = require('./app/main.window');

ipcMain.on('info', (e, data) => {
  console.log(e.sender, data);
});

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
