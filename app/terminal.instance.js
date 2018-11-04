const xterm = require('xterm');
const nodePty = require('node-pty');
const { fit, proposeGeometry } = require('xterm/lib/addons/fit/fit');

module.exports = class Terminal {

  constructor(element, descriptor) {
    this._element = element;
    this._descriptor = descriptor;
    this._innerTerminal = new xterm.Terminal(descriptor.terminal);
    this._innerTerminal.open(this._element);
    this._innerTerminal.write('urrp!');
    this.resize();
  }

  resize() {
    console.log(proposeGeometry(this._innerTerminal));
    fit(this._innerTerminal);
  }

}
