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

let clickProcessingFlag: boolean = false;

type BrowsingManagedObject = {
  win: BrowserWindow;
  event: any;
  htdId: string;
}

type ReturnObj = {
  type: string,
  htdId: string
}


class IPCForBrowsing {

  private manageObj: Map<number, BrowsingManagedObject>;
  private currentFlow: Array<any>;

  constructor() {
    this.manageObj = new Map();
    this.currentFlow = [];

  }

  start(): void {
    Object.keys(CONFIG).forEach(KEY => {
      this.activateBrowsing(KEY);
    });
  }

  activateBrowsing(KEY): void {

    ipcMain.on(CONFIG[KEY]['FROMVUE'], (event, procedure) => {
      this[method[KEY]](event, procedure);
    });
  }

  /**
   @param tuple {Tuple(url: String, flow: [Action])}
   */
  executeBrowsing(event, tuple): void {
    const url = tuple._1;
    const flow = tuple._2;

    const currentProcessCheck = this.currentFlow.every(t => !(url === t._1 && JSON.stringify(flow) === JSON.stringify(t._2)));
    if (!currentProcessCheck) return;

    this.currentFlow.push(tuple);

    const htdId = flow[0].id.split('#')[0];
    const id = this.createWindow(event, url, htdId);

    flow.reduce((prev, action) => prev.then(() => {
      // Clickの場合は確率調整
      if (action.type === 'CLICK' && this.abandonClick(action.ctr)) return;
      return this.executeAction(id, action);
    }), Promise.resolve())
    .then(() => {
      // console.log('終了！');
      this.readyRecieveEvent(CONFIG['EXECUTE']['TOVUE'], id, this.createReturnObj('PV', this.manageObj.get(id).htdId));
      this.currentFlow = this.currentFlow.filter(t => !(tuple._1 === t._1 && JSON.stringify(tuple._2) === JSON.stringify(t._2)));
      this.closeWindow(id);
    })
    .catch(() => {
      this.readyRecieveEvent(CONFIG['EXECUTE']['TOVUE'], id, this.createReturnObj('PVERROR!', this.manageObj.get(id).htdId));
      this.currentFlow = this.currentFlow.filter(t => !(tuple._1 === t._1 && JSON.stringify(tuple._2) === JSON.stringify(t._2)));
      this.closeWindow(id);
    });
  }

  /**
    @param tuple {Tuple(url: String, action: Action)}
  */
  activateSimulate(event, tuple): void {
    const url = tuple._1;
    const action = tuple._2;
    const htdId = action.id.split('#')[0];
    const id = this.createWindow(event, url, htdId);
    this.executeAction(id, action);
  }

  createWindow(event, url, htdId): number {
    let win = new BrowserWindow({
      // nodeIntegration: 'iframe',
      webPreferences: {webSecurity: false},
      frame: false,
      width: 1500,
      height: 900 });

    win.loadURL(url);

    win.on('closed', () => {
      win = null;
    });

    this.registerManageObj(win.id, {win ,event, htdId});
    return win.id;
  }

  registerManageObj(id: number, obj: BrowsingManagedObject) {
    this.manageObj.set(id, obj);
  }

  executeAction(id, action): Promise<any> {
    return this[browsingMethod[action.type]](id, action);
  }

  abandonClick(ctr) {
   return ctr !== 0 ? ctr <= Math.random() : false;
  }

  executeClick(id, action): Promise<any>  {

    if (clickProcessingFlag) {
      // console.log('来ない');
      return;
    }
    // console.log('来た');
    clickProcessingFlag = true;

    // スクロール　+ 要素の画面全体での位置を取得
    return this.executeJS(id, HuntedBrowsingService.actionToStr(action))
      .then(res => {
        const resObj = JSON.parse(res);
        console.log(resObj);
        return resObj;
      })
      .then(browserPosition => {  // マウスをクリック位置まで動かす
        return new Promise(resolve => {
          this.focusWindow(id);
          this.moveMouseSmooth(this.calcMousePosition(action.item, browserPosition));
          resolve();
        })
      })
      .then(() => {
        return new Promise(resolve => {
          this.focusWindow(id);
          setTimeout(() => {
            clickProcessingFlag = false;
            resolve();
          }, 500);
        });
      })
      .then(() => { // クリックする
        return new Promise(resolve => {
          this.executeMouseClick();
          this.readyRecieveEvent(CONFIG['EXECUTE']['TOVUE'], id, this.createReturnObj('CLICKED!!', this.manageObj.get(id).htdId));
          // console.log('クリック完了1', new Date());
          setTimeout(() => {
            clickProcessingFlag = false;
            resolve();
          }, 2000);
        })
      })
      .catch(e => {
        console.log('Click process Failed');
        console.error(e);
        throw 'Error';
      });
  }

  focusWindow(id) {
    console.log('Focus!!!!!');
    this.manageObj.get(id).win.show();
  }

  executeScreenOperation(id, action): Promise<{}> {
    // スクロールの実行 or オペレーションの実行
    return this.executeJS(id, HuntedBrowsingService.actionToStr(action));
  }

  executeJS(id, funcStr): Promise<any> {
    return this.manageObj.get(id).win.webContents.executeJavaScript(funcStr, true)
      .catch(e => {
        console.error(e);
        throw 'Error';
      });
  }

  readyRecieveEvent(toActionType, id, recievedData) {
    this.manageObj.get(id).event.sender.send(toActionType, recievedData);
  }

  moveMouseSmooth(moveTo): void {
    robot.moveMouseSmooth(40, 300);
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

  closeWindow(id, sec=2000): void {
    if (id === undefined) return;
    // setTimeout(this.manageObj.get(id).win.destroy(), sec);
    this.manageObj.get(id).win.destroy();
    this.manageObj.delete(id);
  }

  createReturnObj(type: string, htdId: string): ReturnObj {
    return {
      type,
      htdId
    };
  }
}

export default class IPCForBrowsingObject {
  static apply(): IPCForBrowsing {
    return new IPCForBrowsing();
  }
};
