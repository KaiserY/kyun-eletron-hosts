import { Component, OnInit, NgZone } from '@angular/core';

import { AppState } from './app.service';
import { HostsService } from './hosts.service';

import * as CodeMirror from 'codemirror';

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
  modifiedFlag = false;

  constructor(
    private _ngZone: NgZone,
    public appState: AppState,
    public hostsService: HostsService) {
    appState.state.version = 1;
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);

    this.textarea = <HTMLTextAreaElement>document.getElementById("app-editor");

    this.hostsPath = this.hostsService.getHostsPath();

    fs.readFile(this.hostsPath, 'utf-8', (err, data) => {
      var text;
      if (err) {
        text = 'error: ' + err;
        console.error(text);
      } else {
        text = data;
      };

      this.appCodeMirror = CodeMirror.fromTextArea(this.textarea, {
        mode: 'hosts',
        theme: "solarized light",
        lineNumbers: true,
        tabSize: 8
      });

      this.appCodeMirror.getDoc().setValue(text);
      this.appCodeMirror.getDoc().clearHistory();

      this.appCodeMirror.on("change", (handler, change) => {
        this._ngZone.run(() => {
          this.modifiedFlag = handler.getDoc().historySize().undo > 0;
        });
      });

      this.appCodeMirror.setOption("extraKeys", {
        "Ctrl-/": (cm) => {
          cm.toggleComment();
        },
        "Ctrl-S": (cm) => {
          this.hostsService.saveHosts(this.removeTrailingNewline(cm.getValue()));
        }
      });
    });
  }

  onSave() {
    var text = this.removeTrailingNewline(this.appCodeMirror.getValue());
    this.hostsService.saveHosts(text);
  }

  removeTrailingNewline(content: string): string {
    return content.replace(/^\s+|\s+$/g, "");
  }
}
