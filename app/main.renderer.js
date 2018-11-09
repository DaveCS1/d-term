const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const terminalManager = require('./terminal.manager');
const consoleOptions = require('./console.options');
const settingsModal = require('./settings.modal');
const draggable = require('./draggable');

currentWindow.on('resize', () => {
  terminalManager.updateSize();
});

currentWindow.on('close', () => {
  terminalManager.terminateAll();
});

currentWindow.webContents.on('devtools-opened', () => {
  terminalManager.updateSize();
});

currentWindow.webContents.on('devtools-closed', () => {
  terminalManager.updateSize();
});

consoleOptions.onOptionClicked((option) => {
  terminalManager.create(option);
});

$('#appVersion').text(remote.app.getVersion());

$('a.project-source-action').on('click', () => {
  remote.shell.openExternal('https://github.com/akasarto/d-term');
});

$('a.show-advanced-settings-action').on('click', () => {
  settingsModal.show();
});

settingsModal.onOptionsUpdated(newOptions => {
  consoleOptions.loadAll();
});

consoleOptions.loadAll();
terminalManager.initialize();

draggable.drag();
