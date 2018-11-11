const repository = require('./repository');
const GoldenLayout = require('golden-layout');
const { remote, ipcRenderer } = require('electron');
const terminal = require('./terminal.instance');
const newId = require('uuid/v1');
const _ = require('lodash');

const config = {
  settings: {
    showPopoutIcon: false,
    showMaximiseIcon: true,
    showCloseIcon: true
  },
  content: []
};

const terminals = [];

let layout = new GoldenLayout(config, document.getElementById('terminals'));

layout.registerComponent('terminal', function (container, descriptor) {

  let element = container.getElement();

  container._config.id = newId();
  element.css({
    'background-color': descriptor.xterm.theme.background
  });

  let wrapper = $('<div/>', {
    id: container._config.id,
    class: 'terminal-wrapper'
  }).appendTo(element);

  let loader = $('<div/>', {
    class: 'standby'
  }).appendTo(element);

  setTimeout(() => {
    let instance = new terminal(container._config);
    terminals.push(instance);
    instance.on('node-pty-ready', (info) => {
      ipcRenderer.send('info', { event: 'node-pty-ready', info });
      loader.remove();
    });
    instance.on('node-pty-exited', (info) => {
      ipcRenderer.send('info', { event: 'node-pty-exited', info });
      let terminal = _.find(terminals, terminal => terminal.id == info.id);
      let index = terminals.indexOf(terminal);
      terminals.splice(index, 1);
      container.close();
    });
    container.on('resize', () => {
      instance.resize();
    });
  }, 1000);

});

layout.on('initialised', function () {
  createPrimaryInstance();
});

layout.on('stateChanged', function () {
  resizeAllTerminals();
});

function resizeAllTerminals() {
  terminals.forEach(terminal => {
    terminal.resize();
  });
}

function getConsoleOptionConfig(consoleOption) {
  var newItemConfig = {
    type: 'component',
    title: consoleOption.label,
    componentName: 'terminal',
    componentState: {
      consoleOption,
      nodePty: {
        name: 'xterm-color'
      },
      xterm: {
        cursorBlink: true,
        cursorStyle: 'underline',
        rightClickSelectsWord: true,
        theme: { background: '#0a0a0a' }
      }
    }
  };
  return newItemConfig;
}

function createTerminalInstance(consoleOption) {
  var newItemConfig = getConsoleOptionConfig(consoleOption);
  if (layout.root.contentItems && layout.root.contentItems.length) {
    layout.root.contentItems[0].addChild(newItemConfig);
    return;
  }
  layout.root.addChild(newItemConfig);
}

function getPrimaryOption() {
  let options = repository.getConsoleOptions();
  let primary = _.filter(options, option => option.primary);
  if (primary && primary.length) {
    return primary[0];
  }
  return options[0];
}

function createPrimaryInstance() {
  let option = getPrimaryOption();
  createTerminalInstance(option);
}

function setDraggableOptions() {
  $('a.console-option-action').each(function (idx, item) {
    let $this = $(item);
    let consoleId = $this.data('option-id');
    let consoleOption = repository.getById(consoleId);
    layout.createDragSource($this, getConsoleOptionConfig(consoleOption));
  });
}

exports.create = (consoleOption) => {
  createTerminalInstance(consoleOption);
}

exports.terminateAll = () => {
  terminals.forEach(instance => {
    instance.terminate();
  });
}

exports.updateSize = () => {
  layout.updateSize();
}

exports.initialize = () => {
  layout.init();
  setDraggableOptions();
}
