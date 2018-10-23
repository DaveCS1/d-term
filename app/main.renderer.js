const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const XTermInstance = require('./xterm.instance');
const instance = new XTermInstance({}, $('#terminal')[0]);

currentWindow.on('resize', () => {
});

currentWindow.on('close', () => {
    instance.terminate();
});

instance.initialize();
