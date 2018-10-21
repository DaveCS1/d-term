const { BrowserWindow } = require('electron');
const windowStateManager = require('electron-window-state');

let instance = null;

exports.create = () => {

  let stateManager = new windowStateManager({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  instance = new BrowserWindow({
    icon: `${__dirname}/../assets/dterm.ico`,
    minWidth: 1176,
    minHeight: 664,
    width: stateManager.width,
    height: stateManager.height,
    x: stateManager.x,
    y: stateManager.y,
    tite: 'dTerm'
  });

  instance.setMenu(null);
  stateManager.manage(this.instance);
  instance.webContents.openDevTools();

  instance.loadFile(`${__dirname}/main.renderer.html`);

  instance.on('unresponsive', function (e) {
    console.log('unresponsive', e);
  });

  instance.webContents.on('crashed', function (e) {
    console.log('crashed', e);
  });

  instance.on('closed', function () {
    instance = null;
  });
}

exports.getInstance = () => {
  return instance;
}