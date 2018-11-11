const path = require('path');
const { remote } = require('electron');
const { EventEmitter } = require('events');
const repository = require('./repository');
const amdLoader = require('monaco-editor/min/vs/loader');
const amdRequire = amdLoader.require;
const toaster = require('bulma-toast');
const _eventEmitter = new EventEmitter();
const _rendererWindow = remote.getCurrentWindow();

let _editor = null;

self.module = undefined;

uriFromPath = (_path) => {
  var pathName = path.resolve(_path).replace(/\\/g, '/');
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
}

parseJSONData = (jsonObject) => {
  return JSON.stringify(jsonObject, null, 2);
}

amdRequire.config({
  baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
});

loadData = (jsonData) => {
  let data = parseJSONData(jsonData);
  let container = document.getElementById('editor');
  if (!_editor) {
    amdRequire(['vs/editor/editor.main'], function () {
      _editor = monaco.editor.create(container, {
        value: data,
        language: 'json',
        lineNumbers: "on",
        roundedSelection: false,
        readOnly: false,
        theme: "vs-dark"
      });
    });
  } else {
    _editor.setValue(data);
  }
}

setData = (jsonData) => {
  var parsedData = parseJSONData(jsonData);
  _editor.setValue(parsedData);
}

closeModal = () => {
  $('.advanced-settings-modal').removeClass('is-active');
}

$('a.toggle-devtools-action').on('click', () => {
  _rendererWindow.webContents.toggleDevTools();
});

$('a.discard-advanced-settings-action').on('click', () => {
  closeModal();
});

$('a.save-advanced-settings-action').on('click', () => {
  try {
    let rawData = _editor.getValue();
    let parsedData = JSON.parse(rawData);
    repository.save(parsedData);
    _eventEmitter.emit('data-changed', parsedData);
    closeModal();
  }
  catch (e) {
    if (e.message.indexOf('SyntaxError')) {
      toaster.toast({
        type: "is-danger",
        message: "Invalid JSON syntax.",
        position: 'center',
        closeOnClick: true,
        duration: 2000
      });
      if (_rendererWindow.webContents.isDevToolsOpened()) {
        throw e;
      }
      return;
    }
    throw e;
  }
});

$('a.reset-options-action').on('click', () => {
  let consoleOptions = repository.getDefaultOptions();
  setData(consoleOptions);
});

exports.show = () => {
  $('.advanced-settings-modal').addClass('is-active');
  let consoleOptions = repository.getConsoleOptions();
  loadData(consoleOptions);
}

exports.onOptionsUpdated = (callback) => {
  _eventEmitter.on('data-changed', callback);
}
