const pty = require('node-pty');
const term = require('xterm').Terminal;
const { remote } = require('electron');
const { proposeGeometry } = require('xterm/lib/addons/fit/fit');

const currentWindow = remote.getCurrentWindow();
const xterm = new term();

const shell = 'C:\\Users\\akasarto\\scoop\\apps\\git\\2.17.1.windows.2\\bin\\sh.exe';

const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cwd: process.cwd(),
    env: process.env
});

xterm.open(document.getElementById('xterm'));

xterm.on('data', (data) => {
    ptyProcess.write(data);
});

ptyProcess.on('data', function (data) {
    xterm.write(data);
});

currentWindow.on('resize', () => {
    setTimeout(() => {
        resizeTerminal();
    }, 100);
});

resizeTerminal = () => {
    let wndSize = currentWindow.getSize();
    let ctnSize = currentWindow.getContentSize();
    let newSize = {
        width: wndSize[0] - (wndSize[0] - ctnSize[0]),
        height: wndSize[1] - (wndSize[1] - ctnSize[1])
    };
    $('.xterm-screen, .xterm-viewport').css(newSize);
    var geometry = proposeGeometry(xterm);
    if (geometry) {
        xterm.reset();
        xterm._core.renderer.clear();
        xterm.resize(geometry.cols, geometry.rows);
        ptyProcess.resize(geometry.cols, geometry.rows);
    }
}
