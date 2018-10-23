const pty = require('node-pty');
const term = require('xterm').Terminal;
const { fit } = require('xterm/lib/addons/fit/fit');

module.exports = class XTermInstance {

    constructor(option, element) {
        this._option = option;
        this._element = element;
        this._terminal = new term({
            theme: { background: '#0a0a0a' }
        });

        this._pty = pty.spawn('powershell.exe', [], {
            name: 'xterm-color',
            cwd: process.cwd(),
            env: process.env,
            cols: 80,
            rows: 30
        });

        this._terminal.open(this._element);

        this._terminal.on('data', (data) => {
            this._pty.write(data);
        });

        this._pty.on('data', (data) => {
            this._terminal.write(data);
        });

        this._pty.on('exit', (data) => {
        });
    }

    fixSize() {
        if (!this._terminal) {
            return;
        }
        fit(this._terminal);
    }

    terminate() {
        if (!this._pty) {
            return;
        }
        this._pty.kill();
    }
}