const GoldenLayout = require('golden-layout');
const consolesRepository = require('./console.repository');
const terminal = require('./terminal.instance');
const { ipcRenderer } = require('electron');
const newId = require('uuid/v1');
const _ = require('lodash');

const terminals = [];

const config = {
  settings: {
    showPopoutIcon: false,
    showMaximiseIcon: true,
    showCloseIcon: true
  },
  content: [{
    type: 'row',
    content: [{
      type: 'component',
      title: 'Command Prompt',
      componentName: 'terminal',
      componentState: {
        consoleOption: {
          id: 1,
          cwd: 'cmd.exe'
        },
        nodePty: {
          name: 'xterm-color',
          cols: 80,
          rows: 30
        },
        xterm: {
          theme: { background: '#0a0a0a' },
          cols: 80,
          rows: 30
        }
      }
    }]
  }]
};

let layout = new GoldenLayout(config, document.getElementById('terminals'));

layout.registerComponent('terminal', function (container, descriptor) {

  console.log('descriptor', descriptor);

  container._config.id = newId();

  container.getElement().css({
    'background-color': descriptor.xterm.theme.background,
    'border': '1px solid red'
  });

  let wrapper = $('<div/>', {
    id: container._config.id,
    class: 'terminal-wrapper'
  }).appendTo(container.getElement());

  let loader = $('<div/>', {
    class: 'standby'
  }).appendTo(container.getElement());

  setTimeout(() => {
    let instance = new terminal(container._config);
    terminals.push(instance);
    instance.on('node-pty-ready', (info) => {
      $('.standby', container.getElement()).remove();
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
  let instances = _.filter(terminals, terminal => terminal.pid > 0);
  terminals.forEach(terminal => {
    terminal.resize();
  });
}

layout.on('stateChanged', function () {
  resizeAllTerminals();
})

exports.initialize = () => {
  layout.init();
  $('a.console-option-action').each(function (idx, item) {
    let $this = $(item);
    let consoleId = $this.data('option-id');
    let consoleOption = consolesRepository.getById(consoleId);
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

exports.updateSize = () => {
  layout.updateSize();
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
