import { Component, OnInit } from '@angular/core';

import { AppState } from './app.service';

import * as fs from 'fs';

@Component({
  selector: 'app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  path = 'C:\\Windows\\System32\\drivers\\etc\\hosts';

  constructor(
    public appState: AppState) {
      appState.state.version = 1;
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);

    console.log(process.env.WINDIR);
    console.log(this.path);

    fs.readFile(this.path, 'utf-8', (err, data) => {
      console.log(err);
      console.log(data);
    });
  }
}
