const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const consoleOptions = require('./console.options');
const settingsModal = require('./settings.modal');
const terminals = require('./terminals');

currentWindow.on('resize', () => {
  terminals.updateSize();
});

currentWindow.on('close', () => {
  terminals.terminateAll();
});

consoleOptions.loadAll();

consoleOptions.onOptionClicked((option) => {
  terminals.create(option);
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

terminals.initialize();
