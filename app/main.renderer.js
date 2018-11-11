const { remote } = require('electron');
const floatingPanel = require('./floating.panel');
const settingsModal = require('./settings.modal');
const terminalManager = require('./terminal.manager');
const mainRendererWindow = remote.getCurrentWindow();

mainRendererWindow.on('close', () => {
  terminalManager.terminateAll();
});

mainRendererWindow.on('resize', () => {
  terminalManager.updateSize();
});

mainRendererWindow.webContents.on('devtools-opened', () => {
  terminalManager.updateSize();
});

mainRendererWindow.webContents.on('devtools-closed', () => {
  terminalManager.updateSize();
});

floatingPanel.onConsoleOptionClicked((consoleOption) => {
  console.log('Clicked', consoleOption);
  //terminalManager.create(option);
});

floatingPanel.onSettingsOptionClicked(() => {
  settingsModal.show();
});

settingsModal.onOptionsUpdated(newOptions => {
  consoleOptions.loadAll();
});

settingsModal.initialize();
floatingPanel.initialize();
terminalManager.initialize();

/*
$('#appVersion').text(remote.app.getVersion());

$('a.project-source-action').on('click', () => {
  remote.shell.openExternal('https://github.com/akasarto/d-term');
});
*/
