/* eslint-disable */
const { BrowserWindow, ipcMain } = require('electron');
const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').SETTING;
const HuntedSettingService = require('../service/HuntedSettingService');

class IPCForSetting {

  constructor() {
    this.win = '';
    this.event = '';
  }

  start() {
    Object.keys(CONFIG).forEach(KEY => {
      this.activateTargetSetting(KEY);
    });
  }

  activateTargetSetting(KEY) {

    ipcMain.on(CONFIG[KEY]['FROMVUE'], (event, url) => {
      this.event = event;
      this.createWindow(url);
      this.readyRecieveEvent(CONFIG[KEY]['FROMRENDERER'], CONFIG[KEY]['TOVUE']);
      this.executeJS(HuntedSettingService.actionToStr(KEY));
      // this.closeWindow();
    });
  }

  createWindow(url) {
    this.win = new BrowserWindow({
      nodeIntegration: 'iframe',
      webPreferences: {webSecurity: false},
      width: 1500,
      height: 900 });

    this.win.loadURL(url);

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  executeJS(funcStr) {
    this.win.webContents.executeJavaScript(funcStr);
  }

  readyRecieveEvent(fromActionType, toActionType) {
   ipcMain.on(fromActionType, (cEvent, recievedItem) => {
     this.event.sender.send(toActionType, recievedItem);
   });
  }

  closeWindow(sec=20000) {
    setTimeout(() => {
      this.win.destroy();
    }, sec);
  }
}

const IPCForSettingObject = class {
  static apply() {
    return new IPCForSetting();
  }
};

module.exports = IPCForSettingObject;