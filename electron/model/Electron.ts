/* eslint-disable */
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

class Electron {

  private win: BrowserWindow;

  constructor() {
    this.win = null;
  }

  start(): void {
    this.mainStart();
    this.readyAfterClosed();
    this.readyActivate();
  }

  mainStart(): void {
    app.on('ready', this.createWindow);
  }

  createWindow(): void {
    this.win = new BrowserWindow({ width: 1500, height: 900 });

    this.win.loadURL(url.format({
      // react-scrpitでビルドされるファイルをロードする
      pathname: path.resolve(__dirname, '../../dist/index.html'),
      protocol: 'file:',
      slashes: true,
    }));


    // デバッグツールはデフォルトOFF.
    this.win.webContents.openDevTools();
    this.win.on('closed', () => {
      this.win = null;
    });
  }

  readyAfterClosed(): void {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  readyActivate(): void {
    app.on('activate', () => {
      if (this.win === null) {
        this.createWindow();
      }
    });
  }

}


export default class ElectronObject {

  static apply(): Electron {
    return new Electron();
  }
}
