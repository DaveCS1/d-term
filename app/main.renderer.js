const pty = require('node-pty');
const term = require('xterm').Terminal;
const { remote, ipcRenderer } = require('electron');
const { fit } = require('xterm/lib/addons/fit/fit');
const currentWindow = remote.getCurrentWindow();

const xterm = new term();

const ptyProcess = pty.spawn('powershell.exe', [], {
    name: 'xterm-color',
    cwd: process.cwd(),
    env: process.env,
    cols: 80,
    rows: 30
});

xterm.open($('#terminal')[0]);

xterm.on('data', (data) => {
    ptyProcess.write(data);
});

ptyProcess.on('data', function (data) {
    xterm.write(data);
});

ptyProcess.on('exit', function (data) {
    currentWindow.close();
});

currentWindow.on('resize', () => {
    fit(xterm);
});

currentWindow.on('close', function () {
    ipcRenderer.send('test', 'Killing pty');
    if (ptyProcess != null) {
        ptyProcess.kill();
        ipcRenderer.send('test', 'Killed pty');
    }
});

fit(xterm);
