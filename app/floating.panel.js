const { EventEmitter } = require('events');
const repository = require('./repository');
const mustache = require('mustache');
const eventEmitter = new EventEmitter();

function bindSettingsAction() {
  $('a.show-advanced-settings-action').on('click', () => {
    eventEmitter.emit('settings-option-clicked');
  });
}

function loadConsoleOptions() {
  $('div.console-options-list').html('');
  let template = $('#consoleOptionsTemplate').html();
  let consoleOptions = repository.getConsoleOptions();
  consoleOptions.forEach(option => {
    let consoleOptionElement = mustache.render(template, option);
    $(consoleOptionElement).on('click', function () {
      let optionId = $(this).data('option-id');
      let optionEntity = repository.getById(optionId);
      eventEmitter.emit('console-option-clicked', optionEntity);
    }).appendTo('div.console-options-list');
  });
}

function makePanelDraggable() {
  let pos1 = pos2 = pos3 = pos4 = 0;
  let panel = $('nav.floating-panel');
  let element = $('nav.floating-panel')[0];
  let elementHandle = $('div.floating-panel-handle')[0];
  panel.css({ bottom: '75px', right: '75px' });
  elementHandle.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
    element.style.right = "";
    element.style.bottom = "";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function setInfo() {
  // $('#appVersion').text(remote.app.getVersion());
  // $('a.project-source-action').on('click', () => {
  //   remote.shell.openExternal('https://github.com/akasarto/d-term');
  // });
}

exports.initialize = () => {
  bindSettingsAction();
  loadConsoleOptions();
  makePanelDraggable();
  setInfo();
}

exports.onConsoleOptionClicked = (callback) => {
  eventEmitter.on('console-option-clicked', callback);
};

exports.onSettingsOptionClicked = (callback) => {
  eventEmitter.on('settings-option-clicked', callback);
};

exports.refresh = () => {
  loadConsoleOptions();
  setInfo();
}
