const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const consoleOptionsKey = 'consoleOptions';

exports.getAll = () => {
    let options = JSON.parse(localStorage.getItem(consoleOptionsKey)) || [];
    if (!options || options.length <= 0) {
        if (process.platform == 'win32') {
            options.push({
                id: uuidv1(),
                cwd: 'cmd.exe',
                icon: 'mdi-console',
                label: 'Command Prompt',
                color: '#eeeeee'
            });
            options.push({
                id: uuidv1(),
                cwd: 'C:\\Users\\akasarto\\scoop\\apps\\git\\2.19.1.windows.1\\bin\\sh.exe',
                icon: 'mdi-git',
                label: 'Git Bash',
                color: '#e24329'
            });
            options.push({
                id: uuidv1(),
                cwd: 'powershell.exe',
                icon: 'mdi-powershell',
                label: 'PowerShell',
                color: '#0168b3'
            });
            options.push({
                id: uuidv1(),
                cwd: 'bash.exe',
                icon: 'mdi-ubuntu',
                label: 'WSL Bash (Ubuntu)',
                color: '#dd4814'
            });
        } else {
            options.push({
                id: uuidv1(),
                cwd: process.env['SHELL'],
                icon: 'mdi-console-line',
                label: 'Shell',
                color: '#dd4814'
            });
        }
        localStorage.setItem(consoleOptionsKey, JSON.stringify(options));
    }
    return options;
}

exports.getById = (optionId) => {
    let options = JSON.parse(localStorage.getItem(consoleOptionsKey)) || [];
    return _.find(options, item => item.id == optionId);
}