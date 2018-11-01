const goldenLayout = require('golden-layout');
const consolesRepository = require('./console.repository');
const consoleProcess = require('./console.process');
const { ipcRenderer } = require('electron');

const processInstances = [];

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
      componentName: 'terminal',
      componentState: { label: 'A' }
    }, {
      type: 'column',
      content: [{
        type: 'component',
        componentName: 'terminal',
        componentState: { label: 'B' }
      }, {
        type: 'component',
        componentName: 'terminal',
        componentState: { label: 'C' }
      }]
    }]
  }]
};

let layout = new goldenLayout(config, document.getElementById('terminals'));

layout.registerComponent('terminal', function (container, componentState) {

  let optionId = 1;
  let optionEntity = consolesRepository.getById(optionId);
  let processInstance = new consoleProcess(optionEntity);

  processInstances.push(processInstance);

  processInstance.on('process-exited', (pid) => {
  });

  container.on('open', function() {
    processInstance.initialize(container.getElement()[0]);
  });

  container.on('resize', function(e) {
    processInstance.setSize();
  });

  container.on('destroy', function(e) {
    processInstance.terminate();
  });
});

exports.initialize = () => {
  layout.init();
}

exports.updateSize = () => {
  layout.updateSize();
}

exports.create = (consoleOption) => {
  console.log('Create', consoleOption);
}

exports.terminateAll = () => {
  processInstances.forEach(isntance => {
    isntance.terminate();
  });
  ipcRenderer.send('info', 'terminating all');
}
