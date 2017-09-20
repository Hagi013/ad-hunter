/* eslint-disable */
const { BrowserWindow, ipcMain } = require('electron');
const robot = require('robotjs');
const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').BROWSING;
const HuntedBrowsingService = require('../service/HuntedBrowsingService');

const method = {
  SIMULATE: 'activateSimulate',
  EXECUTE: '',
}

const brwsingMethod = {
  CLICK: 'executeClick',
  SCROLL: 'executeScroll',
  WAIT: '',
  OPERATION: '',
}

class IPCForBrowsing {

  constructor() {
    this.win = '';
    this.event = '';
  }

  start() {
    Object.keys(CONFIG).forEach(KEY => {
      this.activateBrowsing(KEY);
    });
  }

  activateBrowsing(KEY) {

    ipcMain.on(CONFIG[KEY]['FROMVUE'], (event, procedure) => {
      this.event = event;
      this[method[KEY]](procedure);
      // this.readyRecieveEvent(CONFIG[KEY]['FROMRENDERER'], CONFIG[KEY]['TOVUE']);
      // this.executeJS(HuntedSettingService.actionToStr(KEY));
      // this.closeWindow();
    });
  }

  /**
    @param tuple {Tuple(url: String, action: Action)}
  */
  activateSimulate(tuple) {
    const url = tuple._1;
    const action = tuple._2;
    this.createWindow(url);
    this.executeAction(action);
  }

  createWindow(url) {
    this.win = new BrowserWindow({
      nodeIntegration: 'iframe',
      webPreferences: {webSecurity: false},
      frame: false,
      width: 1500,
      height: 900 });

    this.win.loadURL(url);

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  executeAction(action) {
    this[brwsingMethod[action.type]](action);
  }

  executeClick(action) {

    // スクロール　+ 要素の画面全体での位置を取得
    return this.executeJS(HuntedBrowsingService.actionToStr(action))
      .then(res => {
        const resObj = JSON.parse(res);
        console.log(resObj);
        return resObj;
    })
      .then(browserPosition => {  // マウスをクリック位置まで動かす
        this.moveMouseSmooth(this.calcMousePosition(action.item, browserPosition));
      })
      .then(() => { // クリックする
        this.executeMouseClick();
      })
    // ipcMain.on(CONFIG.FROMRENDERER)
  }


  executeScroll(action) {
    // スクロールの実行
    return this.executeJS(HuntedBrowsingService.actionToStr(action));
  }

  executeJS(funcStr) {
    return this.win.webContents.executeJavaScript(funcStr, true);
  }

  // readyRecieveEvent(fromActionType, toActionType) {
  //  ipcMain.on(fromActionType, (cEvent, recievedData) => {
  //    this.event.sender.send(toActionType, recievedData);
  //  });
  // }

  moveMouseSmooth(moveTo) {
    console.log('moveTo.x, moveTo.y', moveTo.x, moveTo.y);
    robot.moveMouseSmooth(moveTo.x, moveTo.y);
  }

  calcMousePosition(point, browserPosition) {
    console.log('point.x, point.y', point.x, point.y);
    return {
      x: point.x + browserPosition.availX,
      y: point.y + browserPosition.availY,
    }
  }

  executeMouseClick() {
    robot.mouseClick();
  }

  closeWindow(sec=20000) {
    setTimeout(() => {
      this.win.destroy();
    }, sec);
  }
}

const IPCForBrowsingObject = class {
  static apply() {
    return new IPCForBrowsing();
  }
};

module.exports = IPCForBrowsingObject;
