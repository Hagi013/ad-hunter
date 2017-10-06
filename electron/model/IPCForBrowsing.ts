/* eslint-disable */
import { BrowserWindow, ipcMain } from 'electron';
import * as robot from 'robotjs';
import HuntedBrowsingService from '../service/HuntedBrowsingService';
const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').BROWSING;

const method = {
  SIMULATE: 'activateSimulate',
  EXECUTE: 'executeBrowsing',
}

const browsingMethod = {
  CLICK: 'executeClick',
  SCROLL: 'executeScreenOperation',
  OPERATION: 'executeScreenOperation',
}

class IPCForBrowsing {

  private win: BrowserWindow;
  private event: any;
  private currentFlow: Array<any>;

  constructor() {
    this.win = null;
    this.event = null;
    this.currentFlow = [];

  }

  start(): void {
    Object.keys(CONFIG).forEach(KEY => {
      this.activateBrowsing(KEY);
    });
  }

  activateBrowsing(KEY): void {

    ipcMain.on(CONFIG[KEY]['FROMVUE'], (event, procedure) => {
      this.event = event;
      this[method[KEY]](procedure);
      // this.readyRecieveEvent(CONFIG[KEY]['FROMRENDERER'], CONFIG[KEY]['TOVUE']);
      // this.executeJS(HuntedSettingService.actionToStr(KEY));
      // this.closeWindow();
    });
  }

  /**
   @param tuple {Tuple(url: String, flow: [Action])}
   */
  executeBrowsing(tuple): void {
    const url = tuple._1;
    const flow = tuple._2;

    const currentProcessCheck = this.currentFlow.every(t => !(url === t._1 && JSON.stringify(flow) === JSON.stringify(t._2)));
    if (!currentProcessCheck) return;

    this.currentFlow.push(tuple);

    this.createWindow(url);
    flow.reduce((prev, action, index, array) => {
      return prev
        .then(() => { console.log('2', new Date()); return this.executeAction(action) });
    }, Promise.resolve()).then(() =>{
      this.currentFlow = this.currentFlow.filter(t => !(tuple._1 === t._1 && JSON.stringify(tuple._2) === JSON.stringify(t._2)));
    }).catch(() => { this.currentFlow = this.currentFlow.filter(t => !(tuple._1 === t._1 && JSON.stringify(tuple._2) === JSON.stringify(t._2))) });
  }

  /**
    @param tuple {Tuple(url: String, action: Action)}
  */
  activateSimulate(tuple): void {
    const url = tuple._1;
    const action = tuple._2;
    this.createWindow(url);
    this.executeAction(action);
  }

  createWindow(url): void {
    this.win = new BrowserWindow({
      // nodeIntegration: 'iframe',
      webPreferences: {webSecurity: false},
      frame: false,
      width: 1500,
      height: 900 });

    this.win.loadURL(url);

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  executeAction(action): void {
    return this[browsingMethod[action.type]](action);
  }

  executeClick(action): Promise<any>  {

    // スクロール　+ 要素の画面全体での位置を取得
    return this.executeJS(HuntedBrowsingService.actionToStr(action))
      .then(res => {
        const resObj = JSON.parse(res);
        console.log(resObj);
        return resObj;
      })
      .then(browserPosition => {  // マウスをクリック位置まで動かす
        return new Promise(resolve => {
          this.moveMouseSmooth(this.calcMousePosition(action.item, browserPosition));
          console.log('スクロール完了', new Date());
          resolve();
        })
      })
      .then(() => { // クリックする
        return new Promise(resolve => {
          this.executeMouseClick();
          console.log('クリック完了1', new Date());
          setTimeout(() => { resolve(); }, 2000);
        })
      })
    // ipcMain.on(CONFIG.FROMRENDERER)
  }

  executeScreenOperation(action): Promise<{}> {
    // スクロールの実行 or オペレーションの実行
    return this.executeJS(HuntedBrowsingService.actionToStr(action));
  }

  executeJS(funcStr): Promise<any> {
    return this.win.webContents.executeJavaScript(funcStr, true);
  }

  // readyRecieveEvent(fromActionType, toActionType) {
  //  ipcMain.on(fromActionType, (cEvent, recievedData) => {
  //    this.event.sender.send(toActionType, recievedData);
  //  });
  // }

  moveMouseSmooth(moveTo): void {
    robot.moveMouseSmooth(moveTo.x, moveTo.y);
  }

  calcMousePosition(point, browserPosition): object {
    return {
      x: point.x + browserPosition.availX,
      y: point.y + browserPosition.availY,
    }
  }

  executeMouseClick(): void {
    robot.mouseClick();
  }

  closeWindow(sec=20000): void {
    setTimeout(() => {
      this.win.destroy();
    }, sec);
  }
}

export default class IPCForBrowsingObject {
  static apply(): IPCForBrowsing {
    return new IPCForBrowsing();
  }
};
