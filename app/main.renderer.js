const { remote } = require('electron');
const currentWindow = remote.getCurrentWindow();
// const consoleInstance = require('./consoles/console.instance');
// const instance = new consoleInstance({}, $('#terminal')[0]);
const optionsRepository = require('./consoles/console.repository');

// currentWindow.on('resize', () => {
//     instance.fixSize();
// });

// currentWindow.on('close', () => {
//     instance.terminate();
// });

// instance.fixSize();

// Set version
$('#appVersion').text(remote.app.getVersion());

// Create console actions handler
//$('.console-option-action').on('click', function (e) {
consoleOptionAction = ($this) => {
  let optionId = $this.data('id');
  let optionEntity = optionsRepository.getById(optionId);
  $(`
    <li data-item="${optionEntity.id}">
      <a>
        <span class="icon is-small">
          <i class="mdi ${optionEntity.icon}"></i>
        </span>
        <span>${optionEntity.label}</span>
      </a>
    </li>
  `)
  .on('click', function() {
    consoleTabItemAction($(this));
  })
  .appendTo('ul.console-tab-items');
};

// Switch console tab items
//$('.console-tab-items li').on('click', function (e) {
consoleTabItemAction = ($this) => {
  let item = $this.data('item');
  $('.console-tab-items li').removeClass('is-active');
  $('.console-tab-contents div').removeClass('is-active');
  $('div[data-content="' + item + '"]').addClass('is-active');
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
    .on('click', function() {
      consoleOptionAction($(this));
    })
    .appendTo('div.console-options-list');
  });
});