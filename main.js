let mainWindow;

const argsParser = require('args');
const { app, BrowserWindow } = require('electron');
const windowState = require('electron-window-state');

const inputs = argsParser.parse(process.argv);

console.log(inputs);

function createMainWindow() {

  let stateManager = new windowStateManager({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    icon: `${__dirname}/src/assets/dterm.ico`,
    minWidth: 1176,
    minHeight: 664,
    width: stateManager.width,
    height: stateManager.height,
    x: stateManager.x,
    y: stateManager.y,
    tite: 'dTerm'
  });

  mainWindow.setMenu(null);
  stateManager.manage(mainWindow);
  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(`${__dirname}/dist/index.html`);

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

app.once('ready', () => {
  createMainWindow();
});
