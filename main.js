const { app, ipcMain } = require('electron');
const mainWindow = require('./app/main.window');
const consoleInstances = require('./app/consoles/console.instances');
const consoleWindow = require('./app/consoles/console.window');

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

ipcMain.on('create-console-instance', (event, option) => {

  console.log('Creating console', option);

  consoleWindow.create(mainWindow.getInstance(), option);

  // consoleInstances.track(consoleWindow);

});