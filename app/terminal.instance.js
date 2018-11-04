const xterm = require('xterm');
const nodePty = require('node-pty');
const { fit, proposeGeometry } = require('xterm/lib/addons/fit/fit');

module.exports = class Terminal {

  constructor(descriptor) {
    this._descriptor = descriptor;
    this._wrapperElement = document.getElementById(this._descriptor.id);
    this._innerTerminal = new xterm.Terminal(this._descriptor.componentState.terminal);
    this._innerTerminal.open(this._wrapperElement);
    this._innerTerminal.write('urrp!');
    this.resize();
  }

  get id() {
    return this._id;
  }

  get pid() {
    return -1;
  }

  resize() {
    console.log(proposeGeometry(this._innerTerminal));
    fit(this._innerTerminal);
  }

}
