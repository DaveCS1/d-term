const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const instance = new term({}, $('#terminal')[0]);
const term = require('./xterm.instance');

currentWindow.on('resize', () => {
    fit(xterm);
});

currentWindow.on('close', () => {
    instance.terminate();
});

instance.initialize();
