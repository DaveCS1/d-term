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

layout.on('stateChanged', function () {
  resizeAllTerminals();
})

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
      loader.remove();
    });
    instance.on('node-pty-exited', (info) => {
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

function resizeAllTerminals() {
  terminals.forEach(terminal => {
    terminal.resize();
  });
}

exports.create = (consoleOption) => {
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
        theme: { background: '#0a0a0a' }
      }
    }
  };
  layout.root.contentItems[0].addChild(newItemConfig);
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
  $('a.console-option-action').each(function (idx, item) {
    let $this = $(item);
    let consoleId = $this.data('option-id');
    let consoleOption = repository.getById(consoleId);
    layout.createDragSource($this, {
      type: 'component',
      title: consoleOption.label,
      componentName: 'terminal',
      componentState: {
        consoleOption,
        nodePty: {
          name: 'xterm-color'
        },
        xterm: {
          theme: { background: '#0a0a0a' }
        }
      }
    });
  });
}
