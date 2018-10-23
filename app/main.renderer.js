const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const termInstance = require('./xterm.instance');
const instance = new termInstance({}, $('#terminal')[0]);

currentWindow.on('resize', () => {
});

currentWindow.on('close', () => {
    instance.terminate();
});

instance.initialize();
