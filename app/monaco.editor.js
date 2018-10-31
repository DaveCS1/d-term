const path = require('path');
const amdLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;

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

self.module = undefined;

exports.show = (lang, jsonData, containerId) => {
  var data = parseJSONData(jsonData);
  if (!editor) {
    amdRequire(['vs/editor/editor.main'], function () {
      editor = monaco.editor.create(document.getElementById(containerId), {
        value: data,
        language: lang,
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

exports.getData = () => {
  return editor.getValue();
}

exports.setData = (jsonData) => {
  var parsedData = parseJSONData(jsonData);
  editor.setValue(parsedData);
}
