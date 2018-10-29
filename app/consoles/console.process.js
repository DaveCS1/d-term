const pty = require('node-pty');
const term = require('xterm').Terminal;
const { fit } = require('xterm/lib/addons/fit/fit');
const { EventEmitter } = require('events');

module.exports = class ConsoleProcess extends EventEmitter {

  constructor(consoleOption) {
    super();
    this._option = Object.assign({}, consoleOption);
    this._pty = pty.spawn(this._option.cwd, [], {
      name: 'xterm-color',
      cwd: process.cwd(),
      env: process.env,
      cols: 80,
      rows: 30
    });
  }

  get id() {
    return this._pty.pid;
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

  initialize(elementId) {
    this._element = document.getElementById(elementId);

    this._terminal = new term({
      theme: { background: '#242424' }
    });

    this._terminal.open(this._element);

    this._terminal.on('data', (data) => {
      this._pty.write(data);
    });

    this._pty.on('data', (data) => {
      this._terminal.write(data);
    });

    this._pty.on('exit', (data) => {
      this.emit('process-exited', this.id);
      this._pty = null;
      this._option = null;
      this._element = null;
      this._terminal = null;
    });

    this.fixSize();
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
