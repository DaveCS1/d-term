const { app, ipcMain } = require('electron');
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

ipcMain.on('test', (e, data) => {
  console.log(data);
});

ipcMain.on('create-console-instance', (event, option) => {

  console.log('Creating console', option);

});