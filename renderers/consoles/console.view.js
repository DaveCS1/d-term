
var pty = require('node-pty');
var term = require('xterm').Terminal;

const xterm = new term();

const shell = 'C:\\Users\\akasarto\\scoop\\apps\\git\\2.17.1.windows.2\\bin\\sh.exe';

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cwd: process.cwd(),
  env: process.env
});

xterm.open(
    document.getElementById('xterm')
);

xterm.on('data', (data) => {
  ptyProcess.write(data);
});

ptyProcess.on('data', function (data) {
  xterm.write(data);
});

