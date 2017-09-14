/* eslint-disable */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

class Electron {

  constructor() {
    this.win = '';
  }

  start() {
    this.mainStart();
    this.readyAfterClosed();
    this.readyActivate();
  }

  mainStart() {
    app.on('ready', this.createWindow);
  }

  createWindow() {
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

  readyAfterClosed() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  readyActivate() {
    app.on('activate', () => {
      if (electron.win === null) {
        this.createWindow();
      }
    });
  }

}


const ElectronObject = class {

  static apply() {
    return new Electron();
  }
}

module.exports = ElectronObject;
