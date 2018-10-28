const fs = require('fs');
const pty = require('node-pty');
const term = require('xterm').Terminal;
const { fit } = require('xterm/lib/addons/fit/fit');
const uuidv1 = require('uuid/v1');

module.exports = class ConsoleProcess {

    constructor(consoleOption) {
        this._id = uuidv1();
        this._option = Object.assign({}, consoleOption);
        this._pty = pty.spawn(this._option.cwd, [], {
            name: 'xterm-color',
            cwd: process.cwd(),
            env: process.env,
            cols: 80,
            rows: 30
        });
    }

    get canInitialize() {
        return this._pty.pid > 0;
    }

    get label() {
        return this._option.label;
    }

    get icon() {
        return this._option.icon;
    }

    get color() {
        return this._option.color;
    }

    initialize() {
        this._element = document.getElementById(this._id);

        this._terminal = new term({
            theme: { background: '#121212' }
        });

        this._terminal.open(this._element);

        this._terminal.on('data', (data) => {
            this._pty.write(data);
        });

        this._pty.on('data', (data) => {
            this._terminal.write(data);
        });

        this._pty.on('exit', (data) => {
            this._id = null;
            this._pty = null;
            this._option = null;
            this._element = null;
            this._terminal = null;
        });
    }

    fixSize() {
        if (!this._terminal) {
            return;
        }
        fit(this._terminal);
        this._pty.resize(
            this._terminal.cols,
            this._terminal.rows
        );
    }

    terminate() {
        if (!this._pty) {
            return;
        }
        this._pty.kill();
    }
}