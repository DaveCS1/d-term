const pty = require('node-pty');
const term = require('xterm').Terminal;
const { remote } = require('electron');
const { fit, proposeGeometry } = require('xterm/lib/addons/fit/fit');
const currentWindow = remote.getCurrentWindow();

const xterm = new term();
// const xterm = new term({
//     'theme': { background: '#fdf6e3' }
// });

//const shell = 'powershell.exe';
const shell = 'C:\\Users\\akasarto\\scoop\\apps\\git\\2.17.1.windows.2\\bin\\sh.exe';

const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cwd: process.cwd(),
    env: process.env,
    cols: 80,
    rows: 30
});

xterm.open(document.getElementById('xterm'));

xterm.on('data', (data) => {
    ptyProcess.write(data);
});

ptyProcess.on('data', function (data) {
    xterm.write(data);
});

currentWindow.on('resize', () => {
    resizeTerminal();
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
