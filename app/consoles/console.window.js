const { BrowserWindow } = require('electron');

let instance;

exports.create = (parent, option) => {

  instance = new BrowserWindow({
    useContentSize: true,
    icon: `${__dirname}/../../assets/dterm.ico`,
    tite: option.name,
    parent: parent,
    show: false
  });

  instance.setMenu(null);
  instance.webContents.openDevTools();

  instance.loadFile(`${__dirname}/console.renderer.html`);

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