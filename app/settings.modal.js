const path = require('path');
const { remote } = require('electron');
const { EventEmitter } = require('events');
const currentWindow = remote.getCurrentWindow();
const consolesRepository = require('./console.repository');
const amdLoader = require('monaco-editor/min/vs/loader');
const amdRequire = amdLoader.require;
const toaster = require('bulma-toast');
const emitter = new EventEmitter();

self.module = undefined;

let editor;

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
  if (!editor) {
    amdRequire(['vs/editor/editor.main'], function () {
      editor = monaco.editor.create(container, {
        value: data,
        language: 'json',
        lineNumbers: "on",
        roundedSelection: false,
        readOnly: false,
        theme: "vs-dark"
      });
    });
  } else {
    editor.setValue(data);
  }
}

setData = (jsonData) => {
  var parsedData = parseJSONData(jsonData);
  editor.setValue(parsedData);
}

closeModal = () => {
  $('.advanced-settings-modal').removeClass('is-active');
}

$('a.toggle-devtools-action').on('click', () => {
  currentWindow.webContents.toggleDevTools();
});

$('a.discard-advanced-settings-action').on('click', () => {
  closeModal();
});

$('a.save-advanced-settings-action').on('click', () => {
  try {
    let rawData = editor.getValue();
    let parsedData = JSON.parse(rawData);
    consolesRepository.save(parsedData);
    emitter.emit('data-changed', parsedData);
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
      if (currentWindow.webContents.isDevToolsOpened()) {
        throw e;
      }
      return;
    }
    throw e;
  }
});

$('a.reset-options-action').on('click', () => {
  let consoleOptions = consolesRepository.getDefaultOptions();
  setData(consoleOptions);
});

exports.show = () => {
  $('.advanced-settings-modal').addClass('is-active');
  let consoleOptions = consolesRepository.getAll();
  loadData(consoleOptions);
}

exports.onOptionsUpdated = (callback) => {
  emitter.on('data-changed', callback);
}
