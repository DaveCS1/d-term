const { BrowserWindow } = require('electron');
const windowStateManager = require('electron-window-state');

exports.create = () => {

  let stateManager = new windowStateManager({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  this.instance = new BrowserWindow({
    icon: `${__dirname}/../assets/dterm.ico`,
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

  this.instance.loadFile(`${__dirname}/main.renderer.html`);

  this.instance.on('unresponsive', function (e) {
    console.log('unresponsive', e);
  });

  this.instance.webContents.on('crashed', function (e) {
    console.log('crashed', e);
  });

  this.instance.on('closed', function () {
    this.instance = null;
  });
}

exports.getInstance = () => {
  return this.instance;
}

exports.instance;