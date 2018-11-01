const { EventEmitter } = require('events');
const consolesRepository = require('./console.repository');
const mustache = require('mustache');
const emitter = new EventEmitter();

const consoleOptionTpl = `
  <a class="console-option-action tooltip is-tooltip-bottom is-tooltip-primary" data-tooltip="{{label}}" aria-label="{{label}" title="{{label}}" data-option-id="{{id}}">
    <span class="icon is-medium" style="color:{{color}};">
        <i class="mdi mdi-24px {{icon}}" aria-hidden="true"></i>
    </span>
  </a>
`;

exports.loadAll = () => {
  $('div.console-options-list').html('');
  let consoleOptions = consolesRepository.getAll();
  consoleOptions.forEach(option => {
    let consoleOptionElement = mustache.render(consoleOptionTpl, option);
    $(consoleOptionElement).on('click', function () {
      let optionId = $(this).data('option-id');
      let optionEntity = consolesRepository.getById(optionId);
      emitter.emit('option-clicked', optionEntity);
    }).appendTo('div.console-options-list');
  });
}

exports.onOptionClicked = (callback) => {
  emitter.on('option-clicked', callback);
};
