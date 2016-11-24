import { Injectable } from '@angular/core';

import * as os from 'os';
import * as fs from 'fs';

var sudo = require('sudo-prompt');

@Injectable()
export class HostsService {
  hostsPath = this.getHostsPath();

  sudoOptions = {
    name: 'test'
  };

  getHostsPath(): string {
    switch (os.platform()) {
      case 'win32':
        return process.env.WINDIR + '\\System32\\drivers\\etc\\hosts';
      case 'linux':
        return '/etc/hosts';
    };
  }

  saveHosts(hostsContent: String) {
    switch (os.platform()) {
      case 'win32':
        var content = "takeown /f " + this.hostsPath + "\r\n";

        var lines = hostsContent.split(/\r?\n/);

        for (var i = 0; i < lines.length; i++) {
          var action = ">>";

          if (i === 0) {
            action = ">";
          }

          if (lines[i] === '') {
            content += action + ' "' + this.hostsPath + '" echo[\r\n';
          } else {
            content += action + ' "' + this.hostsPath + '" echo ' + lines[i] + '\r\n';
          }
        }

        var tmpBatch = process.env.temp + '\\electron-hosts-' + Math.random() + '.bat';
        fs.writeFile(tmpBatch, content, (error) => {
          if (error) {
            console.error('write file error: ' + error);
          } else {
            var cmd = 'call "' + tmpBatch + '"';
            // var cmd = "echo hello"
            sudo.exec(cmd, this.sudoOptions, (error) => {
              if (error) {
                console.error('sudo error: ' + error);
              } else {
                console.log('sudo done!');
              }
              fs.unlink(tmpBatch, (error) => {
                if (error) {
                  console.error('delete error: ' + error);
                } else {
                  console.log('delete file done!');
                }
              });
            });
          }
        });
        break;
      case 'linux':
        var cmd = 'sh -c \'echo "' + hostsContent + '" > ' + this.hostsPath + '\'';
        sudo.exec(cmd, this.sudoOptions, (error) => {
          if (error) {
            console.error('sudo error: ' + error);
          } else {
            console.log('sudo done!');
          }
        });
        break;
    };
  }
}
