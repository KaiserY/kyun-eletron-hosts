import { Injectable } from '@angular/core';

import * as os from 'os';
import * as fs from 'fs';

let sudo = require('sudo-prompt');

@Injectable()
export class HostsService {

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

  readHosts(): Promise<string> {
    return new Promise((fulfill, reject) => {
      fs.readFile(this.getHostsPath(), 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          fulfill(data);
        }
      });
    });
  }

  saveHosts(hostsContent: String): Promise<any> {
    return new Promise((fulfill, reject) => {
      try {
        switch (os.platform()) {
          case 'win32':
            let command = 'takeown /f ' + this.getHostsPath();
            let hostLines = hostsContent.split(/\r?\n/);

            for (let i = 0; i < hostLines.length; i++) {
              let action = '>>';

              if (i === 0) {
                action = '>';
              }

              if (hostLines[i].trim() === '') {
                command += '& ' + action + ' "' + this.getHostsPath() + '" echo[';
              } else {
                command += '& ' + action + ' "' + this.getHostsPath()
                  + '" echo ' + hostLines[i];
              }
            }

            console.log(command);

            sudo.exec(command, this.sudoOptions, (sudoError) => {
              if (sudoError) {
                console.error('sudo error: ' + sudoError);
                reject(sudoError);
              } else {
                console.log('sudo done!');
                fulfill();
              }
            });
            break;
          case 'win32_backup':
            let content = 'takeown /f ' + this.getHostsPath() + '\r\n';

            let lines = hostsContent.split(/\r?\n/);

            for (let i = 0; i < lines.length; i++) {
              let action = '>>';

              if (i === 0) {
                action = '>';
              }

              if (lines[i] === '') {
                content += action + ' "' + this.getHostsPath() + '" echo[\r\n';
              } else {
                content += action + ' "' + this.getHostsPath() + '" echo ' + lines[i] + '\r\n';
              }
            }

            let tmpBatch = process.env.temp + '\\electron-hosts-' + Math.random() + '.bat';
            fs.writeFile(tmpBatch, content, (writeFileError) => {
              if (writeFileError) {
                console.error('write file error: ' + writeFileError);
                reject(writeFileError);
                return;
              } else {
                let cmd = 'call "' + tmpBatch + '"';
                try {
                  sudo.exec(cmd, this.sudoOptions, (sudoError) => {
                    fs.unlink(tmpBatch, (deleteFileError) => {
                      if (deleteFileError) {
                        console.error('delete error: ' + deleteFileError);
                        reject(deleteFileError);
                        return;
                      } else {
                        console.log('delete file done!');

                        if (sudoError) {
                          console.error('sudo error: ' + sudoError);
                          reject(sudoError);
                          return;
                        } else {
                          console.log('sudo done!');
                          fulfill();
                        }
                      }
                    });
                  });
                } catch (ex) {
                  console.error(ex);
                  reject(ex);
                }
              }
            });
            break;
          case 'linux':
          case 'darwin':
            let cmd = 'sh -c \'echo "' + hostsContent + '" > ' + this.getHostsPath() + '\'';
            sudo.exec(cmd, this.sudoOptions, (sudoError) => {
              if (sudoError) {
                console.error('sudo error: ' + sudoError);
                reject(sudoError);
              } else {
                console.log('sudo done!');
                fulfill();
              }
            });
            break;
          default:
            reject('not supported');
            break;
        };
      } catch (ex) {
        console.error(ex);
        reject(ex);
      }
    });
  }
}
