const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
const consoleProcess = require('./consoles/console.process');
const optionsRepository = require('./consoles/console.repository');

currentWindow.on('resize', () => {
  //instance.fixSize();
});

currentWindow.on('close', () => {
  //instance.terminate();
});

// Set version
$('#appVersion').text(remote.app.getVersion());

// Create console actions handler
consoleOptionAction = ($this) => {
  let optionId = $this.data('id');
  let optionEntity = optionsRepository.getById(optionId);
  let processInstance = new consoleProcess(optionEntity);
  if (processInstance.canInitialize) {
    $(`<div />`, {
      id: processInstance._id,
      class: "fullscreen terminal-instance"
    }
    ).appendTo('div.console-tab-contents');

    $('.console-tab-items li').removeClass('is-active');
    $('div.terminal-instance').removeClass('is-active');

    $(`
      <li data-process-id="${processInstance._id}">
        <a>
          <span class="icon is-small">
            <i class="mdi ${optionEntity.icon}"></i>
          </span>
          <span>${optionEntity.label}</span>
        </a>
      </li>
    `)
      .on('click', function () {
        consoleTabItemAction($(this));
      })
      .appendTo('ul.console-tab-items')
      .addClass('is-active');

    processInstance.initialize();
    processInstance.fixSize();
  }
};

// Switch console tab items
consoleTabItemAction = ($this) => {
  let processId = $this.data('process-id');
  $('.console-tab-items li').removeClass('is-active');
  $('div.terminal-instance').removeClass('is-active');
  // $('div.terminal-instance').fadeOut('slow', function() {
  //   $(this).removeClass('is-active');
  //   $(`#${processId}`).fadeIn('slow', function() {
  //     $(this).addClass('is-active');
  //   });
  // });
  $(`#${processId}`).addClass('is-active');
  $this.addClass('is-active');
};

// Initialize renderer
$(document).ready(() => {
  let options = optionsRepository.getAll();
  options.forEach(option => {
    $(`
      <a class="level-item console-option-action" aria-label="${option.label}" title="${option.label}" data-id="${option.id}">
          <span class="icon is-large" style="color:${option.color};">
              <i class="mdi mdi-36px ${option.icon}" aria-hidden="true"></i>
          </span>
      </a>
    `)
      .on('click', function () {
        consoleOptionAction($(this));
      })
      .appendTo('div.console-options-list');
  });
});