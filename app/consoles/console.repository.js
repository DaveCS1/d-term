const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const consoleOptionsKey = 'consoleOptions';

exports.getDefaultOptions = () => {
  let options = [];
  if (process.platform == 'win32') {
    options.push({
      id: 1,
      cwd: 'cmd.exe',
      icon: 'mdi-console',
      label: 'Command Prompt',
      color: '#eeeeee'
    });
    options.push({
      id: 2,
      cwd: 'C:\\Users\\akasarto\\scoop\\apps\\git\\2.19.1.windows.1\\bin\\sh.exe',
      icon: 'mdi-git',
      label: 'Git Bash',
      color: '#e24329'
    });
    options.push({
      id: 3,
      cwd: 'powershell.exe',
      icon: 'mdi-powershell',
      label: 'PowerShell',
      color: '#0168b3'
    });
    options.push({
      id: 4,
      cwd: 'bash.exe',
      icon: 'mdi-ubuntu',
      label: 'WSL Bash (Ubuntu)',
      color: '#dd4814'
    });
  } else {
    options.push({
      id: 1,
      cwd: process.env['SHELL'],
      icon: 'mdi-console-line',
      label: 'Shell',
      color: '#dd4814'
    });
  }
  return options;
}

exports.getAll = () => {
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

