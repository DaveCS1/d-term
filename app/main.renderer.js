const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
// const consoleInstance = require('./consoles/console.instance');
// const instance = new consoleInstance({}, $('#terminal')[0]);
const options = require('./consoles/console.options');

// currentWindow.on('resize', () => {
//     instance.fixSize();
// });

// currentWindow.on('close', () => {
//     instance.terminate();
// });

//instance.fixSize();

options.loadAll();