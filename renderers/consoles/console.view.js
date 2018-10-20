const pty = require('node-pty');
const term = require('xterm').Terminal;
const { remote } = require('electron');

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
    $('.xterm-screen').css(newSize);
    fit(xterm);
}

proposeGeometry = (term) => {
    if (!term.element.parentElement) {
        return null;
    }
    var parentElementStyle = window.getComputedStyle(term.element.parentElement);
    var parentElementHeight = parseInt(parentElementStyle.getPropertyValue('height'));
    var parentElementWidth = Math.max(0, parseInt(parentElementStyle.getPropertyValue('width')));
    var elementStyle = window.getComputedStyle(term.element);
    var elementPadding = {
        top: parseInt(elementStyle.getPropertyValue('padding-top')),
        bottom: parseInt(elementStyle.getPropertyValue('padding-bottom')),
        right: parseInt(elementStyle.getPropertyValue('padding-right')),
        left: parseInt(elementStyle.getPropertyValue('padding-left'))
    };
    var elementPaddingVer = elementPadding.top + elementPadding.bottom;
    var elementPaddingHor = elementPadding.right + elementPadding.left;
    var availableHeight = parentElementHeight - elementPaddingVer;
    var availableWidth = parentElementWidth - elementPaddingHor - term._core.viewport.scrollBarWidth;
    var geometry = {
        cols: Math.floor(availableWidth / term._core.renderer.dimensions.actualCellWidth),
        rows: Math.floor(availableHeight / term._core.renderer.dimensions.actualCellHeight)
    };
    return geometry;
}

fit = (term) => {
    var geometry = proposeGeometry(term);
    if (geometry) {
        if (term.rows !== geometry.rows || term.cols !== geometry.cols) {
            term._core.renderer.clear();
            term.resize(geometry.cols, geometry.rows);
            ptyProcess.resize(geometry.cols, geometry.rows);
        }
    }
}
