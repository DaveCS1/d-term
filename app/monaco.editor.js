const path = require('path');
const amdLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;

let editor;

function uriFromPath(_path) {
  var pathName = path.resolve(_path).replace(/\\/g, '/');
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
}

amdRequire.config({
  baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
});

self.module = undefined;

exports.initialize = (containerId, lang, data) => {
  if (!editor) {
    amdRequire(['vs/editor/editor.main'], function () {
      editor = monaco.editor.create(document.getElementById(containerId), {
        value: data,
        language: lang,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: "vs-dark"
      });
    });
  }
}

exports.getData = () => {
  return editor.getValue();
}
