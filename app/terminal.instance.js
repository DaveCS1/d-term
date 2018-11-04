const xterm = require('xterm');
const nodePty = require('node-pty');
const { EventEmitter } = require('events');
const { fit, proposeGeometry } = require('xterm/lib/addons/fit/fit');

module.exports = class Terminal extends EventEmitter {

  constructor(descriptor) {
    super();
    this._descriptor = descriptor;
    this._wrapperElement = document.getElementById(this._descriptor.id);
    this.createNodePty();
    this.createXTerm();
  }

  get pid() {
    return this._nodePty.pid;
  }

  createNodePty() {
    let consoleOption = this._descriptor.componentState.consoleOption;
    let nodePtyOptions = Object.assign({}, this._descriptor.componentState.nodePty, {
      cwd: process.cwd(),
      env: process.env
    });
    this._nodePty = nodePty.spawn(consoleOption.cwd, [], nodePtyOptions);
    this._nodePty.on('data', (data) => {
      if (!this._innerTerminal) {
        return;
      }
      this._innerTerminal.write(data);
    });
    this._nodePty.on('exit', (data) => {
      this.emit('node-pty-exited', this.pid);
      this._innerTerminal = null;
      this._nodePty = null;
    });
  }

  createXTerm() {
    let configs = this._descriptor.componentState.terminal;
    this._innerTerminal = new xterm.Terminal(configs);
    this._innerTerminal.open(this._wrapperElement);
    this._innerTerminal.on('data', (data) => {
      if (!this._nodePty) {
        return;
      }
      this._nodePty.write(data);
    });
    this.resize();
  }

  resize() {
    console.log(proposeGeometry(this._innerTerminal));
    if (this._innerTerminal) {
      fit(this._innerTerminal);
    }
    if (this._nodePty) {
      this._nodePty.resize(
        this._innerTerminal.cols,
        this._innerTerminal.rows
      );
    }
  }

}
