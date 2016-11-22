import { Component, OnInit } from '@angular/core';

import { AppState } from './app.service';

@Component({
  selector: 'app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    public appState: AppState) {
      appState.state.version = 1;
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }
}
