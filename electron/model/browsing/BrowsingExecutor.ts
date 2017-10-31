import { BrowserWindow, ipcMain, session } from 'electron';
import * as robot from 'robotjs';
import HuntedBrowsingService from '../../service/HuntedBrowsingService';
import Sender from '../communication/Sender';

const browsingMethod = {
  CLICK: 'executeClick',
  SCROLL: 'executeScreenOperation',
  OPERATION: 'executeScreenOperation',
};

let clickProcessingFlag: boolean = false;

type BrowsingManagedObject = {
  win: BrowserWindow;
  event: any;
  htdId: string;
}

export default class BrowsingExecutor {

  static executeBrowsing(bmo: BrowsingManagedObject, flow): Promise<any> {

    return flow.reduce((prev, action) => prev.then(() => {
      // Clickの場合は確率調整
      if (action.type === 'CLICK' && this.abandonClick(action.ctr)) return;
      return this.executeAction(bmo, action);
    }), Promise.resolve());
  }

  static activateSimulate(bmo: BrowsingManagedObject, action): void {
    this.executeAction(bmo, action);
  }

  private static executeAction(bmo: BrowsingManagedObject, action): Promise<any> {
    return this[browsingMethod[action.type]](bmo, action);
  }

  private static abandonClick(ctr) {
    return ctr !== 0 ? ctr <= Math.random() : false;
  }

  private static executeClick(bmo: BrowsingManagedObject, action): Promise<any>  {

    if (clickProcessingFlag) {
      // console.log('来ない');
      return;
    }
    // console.log('来た');
    clickProcessingFlag = true;

    // スクロール　+ 要素の画面全体での位置を取得
    return this.executeJS(bmo.win, HuntedBrowsingService.actionToStr(action))
      .then(res => {
        const resObj = JSON.parse(res);
        console.log(resObj);
        return resObj;
      })
      .then(browserPosition => {  // マウスをクリック位置まで動かす
        return new Promise(resolve => {
          this.focusWindow(bmo.win);
          this.moveMouseSmooth(this.calcMousePosition(action.item, browserPosition));
          resolve();
        })
      })
      .then(() => {
        return new Promise(resolve => {
          this.focusWindow(bmo.win);
          setTimeout(() => {
            clickProcessingFlag = false;
            resolve();
          }, 500);
        });
      })
      .then(() => { // クリックする
        return new Promise(resolve => {
          this.executeMouseClick();
          // console.log('クリック完了1', new Date());
          setTimeout(() => {
            clickProcessingFlag = false;
            resolve();
          }, 2000);
        });
      })
      .then(() => { // クリックする
        return new Promise(resolve => {
          Sender.sendBrowsingClickEvent(bmo.event, bmo.htdId);
          resolve();
        });
      })
      .catch(e => {
        console.log('Click process Failed');
        console.error(e);
        throw 'Error';
      });
  }

  private static focusWindow(win) {
    console.log('Focus!!!!!');
    win.show();
  }

  private static executeScreenOperation(bmo: BrowsingManagedObject, action): Promise<{}> {
    // スクロールの実行 or オペレーションの実行
    return this.executeJS(bmo.win, HuntedBrowsingService.actionToStr(action));
  }

  private static executeJS(win, funcStr): Promise<any> {
    return win.webContents.executeJavaScript(funcStr, true)
      .catch(e => {
        console.error(e);
        throw 'Error';
      });
  }

  private static moveMouseSmooth(moveTo): void {
    robot.moveMouseSmooth(40, 300);
    robot.moveMouseSmooth(moveTo.x, moveTo.y);
  }

  private static calcMousePosition(point, browserPosition): object {
    return {
      x: point.x + browserPosition.availX,
      y: point.y + browserPosition.availY,
    }
  }

  private static executeMouseClick(): void {
    robot.mouseClick();
  }
}
