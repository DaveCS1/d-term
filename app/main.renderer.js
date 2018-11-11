const { remote } = require('electron');
const floatingPanel = require('./floating.panel');
const settingsModal = require('./settings.modal');
const terminalManager = require('./terminal.manager');

const rendererWindow = remote.getCurrentWindow();

floatingPanel.initialize();

floatingPanel.onConsoleOptionClicked((consoleOption) => {
  console.log('Clicked', consoleOption)
});

floatingPanel.onSettingsOptionClicked(() => {
  settingsModal.show();
});

/*
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



settingsModal.onOptionsUpdated(newOptions => {
  consoleOptions.loadAll();
});

consoleOptions.loadAll();
terminalManager.initialize();

draggable.drag();
*/
