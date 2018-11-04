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
      id: newId(),
      type: 'component',
      componentName: 'terminal',
      componentState: {
        console: {},
        terminal: {
          theme: { background: '#0a0a0a' }
        }
      }
    }]
  }]
};

let layout = new GoldenLayout(config, document.getElementById('terminals'));

layout.registerComponent('terminal', function (container, descriptor) {

  let id = newId();

  let wrapper = $('<div/>', {
    id,
    class: 'terminal-wrapper'
  }).appendTo(container.getElement());

  let loader = $('<div/>', {
    class: 'standby'
  }).appendTo(container.getElement());

  // container.getElement().attr(
  //   'id',
  //   newId
  // );

  // container.getElement().html(`
  //   <div class="icon is-large has-text-white component-loader">
  //     <i class="fas fa-lg fa-spinner fa-pulse"></i>
  //   </div>
  // `);

  // container.getElement().html(`
  //   <div style="position:relative;top:0;left:0;width:100%;height:100%;background:red;">
  //   </div>
  // `);



  // let element = container.getElement();
  // let instance = new terminal(element[0], descriptor);
  // instances.push(instance);

  // container.on('resize', function() {
  // });

});

exports.initialize = () => {
  layout.init();
  $('a.console-option-action').each(function (idx, item) {
    let $this = $(item);
    let consoleId = $this.data('option-id');
    let consoleOption = consolesRepository.getById(consoleId);
    layout.createDragSource($this, {
      id: newId(),
      type: 'component',
      componentName: 'terminal',
      componentState: {
        console: consoleOption,
        terminal: {
          theme: { background: '#0a0a0a' }
        }
      },
      title: consoleOption.label
    });
  });
}

exports.updateSize = () => {
  layout.updateSize();
}

exports.create = (consoleOption) => {
  var newItemConfig = {
    id: newId(),
    type: 'component',
    componentName: 'terminal',
    componentState: {
      console: consoleOption,
      terminal: {
        theme: { background: '#0a0a0a' }
      }
    }
  };
  layout.root.contentItems[0].addChild(newItemConfig);
}

exports.terminateAll = () => {
  terminals.forEach(isntance => {
    isntance.terminate();
  });
  ipcRenderer.send('info', 'terminating all');
}
