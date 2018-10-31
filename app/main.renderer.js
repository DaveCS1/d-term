const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const consolesRepository = require('./consoles/console.repository');
const consoleProcess = require('./consoles/console.process');
const monacoEditor = require('./monaco.editor');
const mustache = require('mustache');
const logger = require('./logger');
const toaster = require('bulma-toast');

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

consoleTabItemAction = ($this) => {
  let processId = $this.data('pid');
  $('.console-tab-items li').removeClass('is-active');
  $('div.terminal-instance').removeClass('is-active');
  $(`#pid${processId}`).addClass('is-active');
  $this.addClass('is-active');
};

loadConsoleOptions = () => {
  $('div.console-options-list').html('');
  let consoleOptions = consolesRepository.getAll();
  consoleOptions.forEach(option => {
    let optionTop = $('#consoleOptionsMenutemTpl').html();
    let optionTopData = mustache.render(optionTop, option);
    $(optionTopData).on('click', function () {
      consoleOptionAction($(this));
    }).appendTo('div.console-options-list');
  });
}

openSettingsModal = () => {
  $('.console-options-modal').addClass('is-active');
}

closeSettingsModal = () => {
  $('.console-options-modal').removeClass('is-active');
}

$(document).ready(function () {

  loadConsoleOptions();

  $('#appVersion').text(remote.app.getVersion());

  $('a.toggle-devtools-action').on('click', () => {
    currentWindow.webContents.toggleDevTools();
  });

  $('a.show-advanced-settings-action').on('click', () => {
    openSettingsModal();
    let consoleOptions = consolesRepository.getAll();
    monacoEditor.show('json', consoleOptions, 'editor');
  });

  $('a.discard-advanced-settings-action').on('click', () => {
    closeSettingsModal();
  });

  $('a.save-advanced-settings-action').on('click', () => {
    try {
      let data = JSON.parse(monacoEditor.getData());
      consolesRepository.save(data);
      loadConsoleOptions();
      closeSettingsModal();
    }
    catch (e) {
      if (e.message.indexOf('SyntaxError')){
        toaster.toast({
          type: "is-danger",
          message: "Invalid JSON syntax.",
          position: 'center',
          closeOnClick: true,
          duration: 2000
        });
        return;
      }
      throw e;
    }
  });

  $('a.reset-options-action').on('click', () => {
    let consoleOptions = consolesRepository.getDefaultOptions();
    monacoEditor.setData(consoleOptions);
  });

  $('a.project-source-action').on('click', () => {
    remote.shell.openExternal('https://github.com/akasarto/d-term');
  });

});
