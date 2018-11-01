const goldenLayout = require('golden-layout');
const consolesRepository = require('./consoles/console.repository');
const consoleProcess = require('./consoles/console.process');
const logger = require('./logger');

var config = {
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

layout.registerComponent('testComponent', function (container, componentState) {
  container.getElement().html('<h2>' + componentState.label + '</h2>');
});

layout.registerComponent('terminal', function (container, componentState) {

  let optionId = 1;
  let optionEntity = consolesRepository.getById(optionId);
  let processInstance = new consoleProcess(optionEntity);

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
