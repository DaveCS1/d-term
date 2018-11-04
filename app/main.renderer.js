const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const terminalManager = require('./terminal.manager');
const consoleOptions = require('./console.options');
const settingsModal = require('./settings.modal');

currentWindow.on('resize', () => {
  terminalManager.updateSize();
});

currentWindow.on('close', () => {
  terminalManager.terminateAll();
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
