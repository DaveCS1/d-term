const { EventEmitter } = require('events');
const consolesRepository = require('./console.repository');
const mustache = require('mustache');
const emitter = new EventEmitter();

const consoleOptionTemplate = $('#consoleOptionsTemplate').html();

exports.loadAll = () => {
  $('div.console-options-list').html('');
  let consoleOptions = consolesRepository.getAll();
  consoleOptions.forEach(option => {
    let consoleOptionElement = mustache.render(consoleOptionTemplate, option);
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
