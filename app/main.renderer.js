const { remote } = require('electron');
const floatingPanel = require('./floating.panel');
const settingsModal = require('./settings.modal');
//const terminalManager = require('./terminal.manager');
const mainRendererWindow = remote.getCurrentWindow();

mainRendererWindow.on('close', () => {
  //terminalManager.terminateAll();
});

mainRendererWindow.on('focus', () => {
  //terminalManager.focusLastInstance();
});

mainRendererWindow.on('resize', () => {
  //terminalManager.updateSize();
});

mainRendererWindow.webContents.on('devtools-opened', () => {
  //terminalManager.updateSize();
});

mainRendererWindow.webContents.on('devtools-closed', () => {
  //terminalManager.updateSize();
});

floatingPanel.onConsoleOptionClicked((option) => {
  //terminalManager.create(option);
});

floatingPanel.onSettingsOptionClicked(() => {
  settingsModal.show();
});

settingsModal.onOptionsUpdated(newOptions => {
  floatingPanel.refresh();
});

settingsModal.initialize();
floatingPanel.initialize();
//terminalManager.initialize();
