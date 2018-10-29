const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const consolesRepository = require('./consoles/console.repository');
const consoleProcess = require('./consoles/console.process');
//const quickView = require('bulma-quickview')();
const mustache = require('mustache');

let processInstances = [];

currentWindow.on('resize', () => {
  processInstances.forEach(instance => {
    instance.fixSize();
  });
});

currentWindow.on('close', () => {
  processInstances.forEach(instance => {
    instance.terminate();
  });
});

// Create console process
consoleOptionAction = ($this) => {
  let optionId = $this.data('option-id');
  let optionEntity = consolesRepository.getById(optionId);
  let processInstance = new consoleProcess(optionEntity);
  if (processInstance.id) {
    let termId = `pid${processInstance.id}`;
    processInstance.on('process-exited', (pid) => {
      if (currentWindow.webContents.isDevToolsOpened()){
        console.log('Process exited [id/pid]', pid);
      }
      $(`li[data-pid='${pid}']`).remove();
      $(`#${termId}`).remove();
    });
    processInstances.push(processInstance);
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
    processInstance.initialize(termId);
  }
};

// Switch console tab items
consoleTabItemAction = ($this) => {
  let processId = $this.data('pid');
  $('.console-tab-items li').removeClass('is-active');
  $('div.terminal-instance').removeClass('is-active');
  $(`#pid${processId}`).addClass('is-active');
  $this.addClass('is-active');
};

// Initialize renderer
$(document).ready(function () {

  let sidePanels = bulmaQuickview.attach();
  let consoleOptions = consolesRepository.getAll();

  consoleOptions.forEach(option => {
    let optionTop = $('#consoleOptionsMenutemTpl').html();
    let optionTopData = mustache.render(optionTop, option);
    let optionSettings =$('#consoleOptionsTableItemTpl').html();
    let optionSettingsData = mustache.render(optionSettings, option);
    $(optionTopData).on('click', function () {
      consoleOptionAction($(this));
    }).appendTo('div.console-options-list');
    $(optionSettingsData).appendTo('.console-options-table tbody');
  });

  $('#appVersion').text(remote.app.getVersion());

  $('a.toggle-devtools-action').on('click', () => {
    currentWindow.webContents.toggleDevTools();
  });

  $('a.config-options-action').on('click', () => {
    $('.console-options-modal').addClass('is-active');
  });

  $('.console-options-modal a.modal-close').on('click', () => {
    $('.console-options-modal').removeClass('is-active');
  });

  $('a.project-source-action').on('click', () => {
    remote.shell.openExternal('https://github.com/akasarto/d-term');
  });

});
