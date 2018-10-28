const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const consoleProcess = require('./consoles/console.process');
const optionsRepository = require('./consoles/console.repository');
//const quickView = require('bulma-quickview')();
const mustache = require('mustache');

currentWindow.on('resize', () => {
  //instance.fixSize();
});

currentWindow.on('close', () => {
  //instance.terminate();
});

// Create console process
consoleOptionAction = ($this) => {
  let optionId = $this.data('id');
  let optionEntity = optionsRepository.getById(optionId);
  let processInstance = new consoleProcess(optionEntity);
  if (processInstance.canInitialize) {
    let tabItemTpl = $('#consoleTabItemTpl').html();
    let terminalTpl = $('#consoleTerminalTpl').html();
    let tabItemData = mustache.render(tabItemTpl, processInstance);
    let terminalData = mustache.render(terminalTpl, processInstance);
    $('.console-tab-items li').removeClass('is-active');
    $('div.terminal-instance').removeClass('is-active');
    $(terminalData).appendTo('div.console-terminals-list');
    $(tabItemData).on('click', function () {
      consoleTabItemAction($(this));
    }).appendTo('ul.console-tab-items');
    processInstance.initialize();
    processInstance.fixSize();
  }
};

// Switch console tab items
consoleTabItemAction = ($this) => {
  let processId = $this.data('process-id');
  $('.console-tab-items li').removeClass('is-active');
  $('div.terminal-instance').removeClass('is-active');
  $(`#${processId}`).addClass('is-active');
  $this.addClass('is-active');
};

// Initialize renderer
let sidePanels = bulmaQuickview.attach();

let options = optionsRepository.getAll();

options.forEach(option => {
  let template = $('#consoleOptionTpl').html();
  let optionData = mustache.render(template, option);
  $(optionData).on('click', function () {
    consoleOptionAction($(this));
  }).appendTo('div.console-options-list');
});

$('#appVersion').text(remote.app.getVersion());

$('a.settings-action').on('click', () => {
  currentWindow.webContents.toggleDevTools();
});

$('a.project-source-action').on('click', () => {
  remote.shell.openExternal('https://github.com/akasarto/d-term');
});

$('#quickviewDefault').on('click', function() {

});
