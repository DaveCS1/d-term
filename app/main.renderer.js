const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const consolesRepository = require('./consoles/console.repository');
const consoleProcess = require('./consoles/console.process');
const monacoEditor = require('./monaco.editor');
const mustache = require('mustache');
const logger = require('./logger');

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
      logger.log(`Process exited [PID: ${pid}]`);
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

  let consoleOptions = consolesRepository.getAll();

  consoleOptions.forEach(option => {
    let optionTop = $('#consoleOptionsMenutemTpl').html();
    let optionTopData = mustache.render(optionTop, option);
    $(optionTopData).on('click', function () {
      consoleOptionAction($(this));
    }).appendTo('div.console-options-list');
  });

  $('#appVersion').text(remote.app.getVersion());

  $('a.toggle-devtools-action').on('click', () => {
    currentWindow.webContents.toggleDevTools();
  });

  $('a.show-advanced-settings-action').on('click', () => {
    $('.console-options-modal').addClass('is-active');
    var data = JSON.stringify(consoleOptions, null, 2);
    monacoEditor.initialize('container', 'json', data);
  });

  $('a.discard-advanced-settings-action').on('click', () => {
    $('.console-options-modal').removeClass('is-active');
  });

  $('a.save-advanced-settings-action').on('click', () => {
    console.log('save...');
  });

  $('a.reset-options-action').on('click', () => {
    console.log('reset...');
  });

  $('button.modal-save').on('click', () => {
    let data = monacoEditor.getData();
    consolesRepository.save(data);
  });

  $('a.project-source-action').on('click', () => {
    remote.shell.openExternal('https://github.com/akasarto/d-term');
  });

});
