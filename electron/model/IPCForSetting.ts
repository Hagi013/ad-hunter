/* eslint-disable */
import { BrowserWindow, ipcMain } from 'electron';
import HuntedSettingService from '../service/HuntedSettingService';
const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').SETTING;

class IPCForSetting {

  private win: BrowserWindow;
  private event: any;
  private actionId: string;

  constructor() {
    this.win = null;
    this.event = null;
    this.actionId = '';
  }

  start(): void {
    Object.keys(CONFIG).forEach(KEY => {
      this.activateTargetSetting(KEY);
    });
  }

  activateTargetSetting(KEY): void {

    ipcMain.on(CONFIG[KEY]['FROMVUE'], (event, tuple) => {
      this.event = event;
      this.actionId = tuple._1;
      const url = tuple._2;
      this.createWindow(url);
      this.readyRecieveEvent(CONFIG[KEY]['FROMRENDERER'], CONFIG[KEY]['TOVUE']);
      this.executeJS(HuntedSettingService.actionToStr(KEY));
      this.closeWindow();
    });
  }

  createWindow(url): void {
    this.win = new BrowserWindow({
      // nodeIntegration: 'iframe',
      webPreferences: {webSecurity: false},
      width: 1500,
      height: 900 });

    this.win.loadURL(url);

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  executeJS(funcStr): void {
    this.win.webContents.executeJavaScript(funcStr);
  }

  readyRecieveEvent(fromActionType, toActionType): void {
   ipcMain.on(fromActionType, (cEvent, recievedItem) => {
     const settings = {
       actionId: this.actionId,
       settings: recievedItem,
     };
     this.event.sender.send(toActionType, settings);
   });
  }

  closeWindow(sec=20000): void {
    setTimeout(() => {
      this.win.destroy();
    }, sec);
  }
}

export default class IPCForSettingObject {
  static apply(): IPCForSetting {
    return new IPCForSetting();
  }
};
