const pty = require('node-pty');
const term = require('xterm').Terminal;
const spawn = require('child_process').spawn;
const { remote, ipcRenderer } = require('electron');
const { proposeGeometry } = require('xterm/lib/addons/fit/fit');
const currentWindow = remote.getCurrentWindow();

const xterm = new term();

const shell = 'powershell.exe';
//const shell = 'C:\\Users\\akasarto\\scoop\\apps\\git\\2.19.1.windows.1\\bin\\sh.exe';

const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cwd: process.cwd(),
    env: process.env,
    cols: 80,
    rows: 30
});

xterm.open(document.getElementById('xterm'));

xterm.on('data', (data) => {
    if (data == '_'){
        console.log(ptyProcess);
    }
    ptyProcess.write(data);
});

ptyProcess.on('data', function (data) {
    xterm.write(data);
});

ptyProcess.on('exit', function (data) {
    currentWindow.close();
});

currentWindow.on('resize', () => {
    resizeTerminal();
});

currentWindow.on('close', function () {
    ipcRenderer.send('test', 'Killing pty');
    if (ptyProcess != null) {
        ptyProcess.kill();
        ipcRenderer.send('test', 'Killed pty');
    }
});

currentWindow.on('ready-to-show', () => {
    $('body').css({
        background: xterm._core.renderer.colorManager.colors.background.css,
        rgb: xterm._core.renderer.colorManager.colors.background.rgb
    });
    resizeTerminal();
    currentWindow.show();
});

resizeTerminal = () => {
    setTimeout(() => {
        let wndSize = currentWindow.getSize();
        let ctnSize = currentWindow.getContentSize();
        let newSize = {
            width: wndSize[0] - (wndSize[0] - ctnSize[0]),
            height: wndSize[1] - (wndSize[1] - ctnSize[1])
        };
        xterm.element.style.height = newSize.height + 'px';
        $('.xterm-screen, .xterm-viewport').css(newSize);
        $('xterm-scroll-area').css({
            height: newSize.height
        });
        var geometry = proposeGeometry(xterm);
        if (geometry) {
            xterm.resize(geometry.cols, geometry.rows);
            ptyProcess.resize(geometry.cols, geometry.rows);
        }
    }, 100);
}
