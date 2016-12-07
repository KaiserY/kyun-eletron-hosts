import { Component, OnInit, NgZone } from '@angular/core';

import { AppState } from './app.service';
import { HostsService } from './hosts.service';

import * as CodeMirror from 'codemirror';

import * as os from 'os';

@Component({
  selector: 'app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  title: string = 'Hosts';

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

    this.appCodeMirror = CodeMirror.fromTextArea(this.textarea, {
      mode: 'hosts',
      theme: 'solarized light',
      lineNumbers: true,
      tabSize: 8
    });

    this.appCodeMirror.on('change', (handler, change) => {

      let equel = (this.textOrigin === handler.getDoc().getValue());

      this.setmModifiedFlag(!equel);
    });

    this.appCodeMirror.setOption('extraKeys', {
      'Ctrl-/': (cm) => {
        cm.toggleComment();
      },
      'Ctrl-S': () => {
        this.onSave();
      }
    });

    this.hostsService.readHosts()
      .then((data) => {

        this.appCodeMirror.getDoc().setValue(data);
        this.appCodeMirror.getDoc().clearHistory();

        this.textOrigin = this.appCodeMirror.getValue();
        this.setmModifiedFlag(false);
      });
  }

  setmModifiedFlag(flag: boolean) {
    this._ngZone.run(() => {
      this.modifiedFlag = flag;
    });
  }

  onSave() {
    let text = this.removeTrailingNewline(this.appCodeMirror.getValue());
    this.hostsService.saveHosts(text).then(() => {
      this.textOrigin = this.appCodeMirror.getValue();
      this.setmModifiedFlag(false);
    }).catch((err) => {
      console.error('onSave error: ' + err);
    });
  }

  removeTrailingNewline(content: string): string {
    return content.replace(/^\s+|\s+$/g, '');
  }
}
