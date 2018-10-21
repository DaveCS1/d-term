const { BrowserWindow } = require('electron');

exports.instance;

exports.create = (parent, option) => {

  this.instance = new BrowserWindow({
    width: 980,
    height: 512,
    webPreferences: { experimentalCanvasFeatures: true },
    icon: `${__dirname}/../../assets/dterm.ico`,
    tite: option.name,
    parent: parent,
    show: false
  });

  this.instance.setMenu(null);
  //this.instance.webContents.openDevTools();

  this.instance.loadFile(`${__dirname}/console.renderer.html`);

  this.instance.on('unresponsive', function (e) {
    console.log('unresponsive', e);
  });

  this.instance.webContents.on('crashed', function (e) {
    console.log('crashed', e);
  });

  this.instance.on('closed', function () {
    instance = null;
  });
}

exports.getInstance = () => {
  return this.instance;
}