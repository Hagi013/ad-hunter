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
      const browsing = tuple._2;
      const url = browsing.url;
      const userAgent = browsing.userAgents[Math.round((browsing.userAgents.length - 1) * Math.random())].value;
      this.createWindow(url, userAgent);
      this.readyRecieveEvent(CONFIG[KEY]['FROMRENDERER'], CONFIG[KEY]['TOVUE']);
      this.executeJS(HuntedSettingService.actionToStr(KEY));
      this.closeWindow();
    });
  }

  createWindow(url, userAgent = ''): void {
    this.win = new BrowserWindow({
      // nodeIntegration: 'iframe',
      // webPreferences: { webSecurity: false, devTools: false, disableBlinkFeatures: 'BlockCredentialedSubresources' },
      webPreferences: { webSecurity: false, devTools: true, disableBlinkFeatures: 'BlockCredentialedSubresources' },
      width: 1500,
      height: 900 });

    this.win.loadURL(url, { userAgent });
    // this.win.loadURL(url, { userAgent: "Mozilla/5.0 (Linux; Android 5.1.1; SM-J111M Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36" });

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

  closeWindow(sec=120000): void {
    setTimeout(() => {
      try {
        this.win.destroy();
      } catch (e) {
        console.error(`${e}`);
      }
    }, sec);
  }
}

export default class IPCForSettingObject {
  static apply(): IPCForSetting {
    return new IPCForSetting();
  }
};
