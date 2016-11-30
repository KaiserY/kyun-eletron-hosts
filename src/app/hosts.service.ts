import { Injectable } from '@angular/core';

import * as os from 'os';
import * as fs from 'fs';

let sudo = require('sudo-prompt');

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
      default:
        return '';
    };
  }

  saveHosts(hostsContent: String) {
    switch (os.platform()) {
      case 'win32':
        let content = 'takeown /f ' + this.hostsPath + '\r\n';

        let lines = hostsContent.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
          let action = '>>';

          if (i === 0) {
            action = '>';
          }

          if (lines[i] === '') {
            content += action + ' "' + this.hostsPath + '" echo[\r\n';
          } else {
            content += action + ' "' + this.hostsPath + '" echo ' + lines[i] + '\r\n';
          }
        }

        let tmpBatch = process.env.temp + '\\electron-hosts-' + Math.random() + '.bat';
        fs.writeFile(tmpBatch, content, (writeFileError) => {
          if (writeFileError) {
            console.error('write file error: ' + writeFileError);
          } else {
            let cmd = 'call "' + tmpBatch + '"';
            // var cmd = "echo hello"
            sudo.exec(cmd, this.sudoOptions, (sudoError) => {
              if (sudoError) {
                console.error('sudo error: ' + sudoError);
              } else {
                console.log('sudo done!');
              }
              fs.unlink(tmpBatch, (deleteFileError) => {
                if (deleteFileError) {
                  console.error('delete error: ' + deleteFileError);
                } else {
                  console.log('delete file done!');
                }
              });
            });
          }
        });
        break;
      case 'linux':
        let cmd = 'sh -c \'echo "' + hostsContent + '" > ' + this.hostsPath + '\'';
        sudo.exec(cmd, this.sudoOptions, (sudoError) => {
          if (sudoError) {
            console.error('sudo error: ' + sudoError);
          } else {
            console.log('sudo done!');
          }
        });
        break;
      default:
        break;
    };
  }
}
