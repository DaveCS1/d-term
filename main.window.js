const { BrowserWindow } = require('electron');
const windowStateManager = require('electron-window-state');

exports.instance;

exports.create = () => {

  let stateManager = new windowStateManager({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  this.instance = new BrowserWindow({
    icon: `${__dirname}/assets/dterm.ico`,
    minWidth: 1176,
    minHeight: 664,
    width: stateManager.width,
    height: stateManager.height,
    x: stateManager.x,
    y: stateManager.y,
    tite: 'dTerm'
  });

  this.instance.setMenu(null);
  stateManager.manage(this.instance);
  this.instance.webContents.openDevTools();

  this.instance.loadFile(`${__dirname}/renderers/main.view.html`);

  this.instance.on('unresponsive', function () {
    console.log('unresponsive');
  });

  this.instance.webContents.on('crashed', function () {
    console.log('crashed');
  });

  this.instance.on('closed', function () {
    this.instance = null;
  });
}