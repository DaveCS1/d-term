import { Terminal } from "xterm";
import { Component, OnInit } from '@angular/core';
import { fit } from 'xterm/lib/addons/fit/fit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'dterm';

  term: Terminal;
  container: any;

  ngOnInit(): void {
    this.term = new Terminal();

    this.container = document.getElementById('terminal');

    this.term.open(this.container);

    this.term.writeln('Welcome to xterm.js');
    this.term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    this.term.writeln('Type some keys and commands to play around.');
    this.term.writeln('');

    this.term.on('key', (key, ev) => {
        this.term.write(key);
    });

    fit(this.term);
  }

}
