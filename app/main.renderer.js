const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const XTermInstance = require('./xterm.instance');
const instance = new XTermInstance({}, $('#terminal')[0]);
const { applyBindings } = require('knockout');

currentWindow.on('resize', () => {
    instance.fixSize();
});

currentWindow.on('close', () => {
    instance.terminate();
});

instance.fixSize();

