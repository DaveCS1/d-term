
const { remote } = require('electron');

let instances = [];

let mainwindow = remote.getCurrentWindow();

console.log(mainwindow.getTitle());

document.getElementById('new').addEventListener('click', () => {

  console.log('Opening...');

  let instance = new remote.BrowserWindow({
    parent: mainwindow,
    width: 500,
    height: 375
  });

  instances.push(instance);

  instance.loadFile('../console/console.view.html');

  instance.on('closed', function () {
    instance = null;
    let idx = instances.indexOf(instance);
    instances.slice(idx, 1);
    console.log('Removed', idx, instances.length);
  });

});