let mainWindow;

const {app, BrowserWindow} = require('electron');
const windowStateManager = require('electron-window-state');

function createMainWindow() {
  let stateManager = new windowStateManager({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    icon: `${__dirname}/assets/dterm.ico`,
    width: stateManager.width,
    height: stateManager.height,
    x: stateManager.x,
    y: stateManager.y
  });

  stateManager.manage(mainWindow);

  mainWindow.loadFile(`${__dirname}/index.html`);

  mainWindow.on('unresponsive', function () {
    console.log('unresponsive');
  });

  mainWindow.webContents.on('crashed', function () {
    console.log('crashed');
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

process.on('uncaughtException', function () {
  console.log('uncaughtException');
});

app.on('ready', function () {
  createMainWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow();
  }
});
