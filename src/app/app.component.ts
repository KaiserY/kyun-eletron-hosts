import { Component, OnInit, NgZone } from '@angular/core';

import { AppState } from './app.service';
import { HostsService } from './hosts.service';

import * as CodeMirror from 'codemirror';

import * as os from 'os';
import * as fs from 'fs';

@Component({
  selector: 'app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  title: string = 'Hosts';
  hostsPath: string = 'the hosts file path...';
  textarea: HTMLTextAreaElement;
  appCodeMirror: CodeMirror.EditorFromTextArea;
  targetIcon: string = 'desktop_windows';

  modifiedFlag: boolean = false;
  textOrigin: string;

  constructor(
    private _ngZone: NgZone,
    public appState: AppState,
    public hostsService: HostsService) {

    this.appState.state.version = process.env.VERSION;

    switch (os.platform()) {
      case 'win32':
        this.targetIcon = 'desktop_windows';
        break;
      case 'linux':
        this.targetIcon = 'desktop_windows';
        break;
      default:
        this.targetIcon = 'desktop_windows';
        break;
    };
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);

    this.textarea = <HTMLTextAreaElement>document.getElementById('app-editor');

    this.hostsPath = this.hostsService.getHostsPath();

    fs.readFile(this.hostsPath, 'utf-8', (err, data) => {
      let text: string;
      if (err) {
        text = 'error: ' + err;
        console.error(text);
      } else {
        text = data;
      };

      this.appCodeMirror = CodeMirror.fromTextArea(this.textarea, {
        mode: 'hosts',
        theme: 'solarized light',
        lineNumbers: true,
        tabSize: 8
      });

      this.appCodeMirror.getDoc().setValue(text);
      this.appCodeMirror.getDoc().clearHistory();

      this.textOrigin = this.appCodeMirror.getValue();

      this.appCodeMirror.on('change', (handler, change) => {

        let equel = (this.textOrigin === handler.getDoc().getValue());

        this._ngZone.run(() => {
          this.modifiedFlag = !equel;
        });
      });

      this.appCodeMirror.setOption('extraKeys', {
        'Ctrl-/': (cm) => {
          cm.toggleComment();
        },
        'Ctrl-S': () => {
          this.onSave();
        }
      });
    });
  }

  resetmModifiedFlag() {
    this._ngZone.run(() => {
      this.modifiedFlag = false;
    });
  }

  onSave() {
    let text = this.removeTrailingNewline(this.appCodeMirror.getValue());
    this.hostsService.saveHosts(text);
    this.resetmModifiedFlag();

    this.textOrigin = this.appCodeMirror.getValue();
  }

  removeTrailingNewline(content: string): string {
    return content.replace(/^\s+|\s+$/g, '');
  }
}
