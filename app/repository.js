const _ = require('lodash');
const consoleOptionsKey = 'consoleOptions';

exports.getDefaultOptions = function() {
  let options = [];
  if (process.platform == 'win32') {
    options.push({
      id: 1,
      cwd: 'cmd.exe',
      args: [],
      icon: 'mdi-console',
      label: 'Command Prompt',
      color: '#eeeeee',
      primary: true,
      order: 1
    });
    options.push({
      id: 2,
      cwd: 'powershell.exe',
      args: [],
      icon: 'mdi-powershell',
      label: 'PowerShell',
      color: '#0168b3',
      primary: false,
      order: 2
    });
    options.push({
      id: 3,
      cwd: 'C:\\Users\\akasarto\\scoop\\apps\\git\\2.19.1.windows.1\\bin\\sh.exe',
      args: [],
      icon: 'mdi-git',
      label: 'Git Bash',
      color: '#e24329',
      primary: false,
      order: 3
    });
    options.push({
      id: 4,
      cwd: process.env['SHELL'],
      args: [],
      icon: 'mdi-ubuntu',
      label: 'WSL Bash (Ubuntu)',
      color: '#dd4814',
      primary: false,
      order: 4
    });
  } else {
    options.push({
      id: 1,
      cwd: process.env['SHELL'],
      args: [],
      icon: 'mdi-console-line',
      label: 'Shell',
      color: '#dd4814',
      primary: true,
      order: 1
    });
  }
  return options;
}

exports.getConsoleOptions = () => {
  let options = JSON.parse(localStorage.getItem(consoleOptionsKey)) || [];
  if (!options || options.length <= 0) {
    options = this.getDefaultOptions();
    this.save(options);
  }
  return options;
}

exports.getById = (optionId) => {
  let options = JSON.parse(localStorage.getItem(consoleOptionsKey)) || [];
  return _.find(options, item => item.id == optionId);
}

exports.save = (data) => {
  if (data) {
    localStorage.setItem(consoleOptionsKey, JSON.stringify(data));
  }
}

