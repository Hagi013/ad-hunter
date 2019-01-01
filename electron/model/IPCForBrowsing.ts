/* eslint-disable */
import { BrowserWindow, ipcMain, session } from 'electron';
import BrowsingExecutor from './browsing/BrowsingExecutor';
import Sender from './communication/Sender';
const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').BROWSING;

const method = {
  SIMULATE: 'activateSimulate',
  EXECUTE: 'executeBrowsing',
  RESET: 'resetBrowsing',
};

type BrowsingManagedObject = {
  win: BrowserWindow;
  event: any;
  htdId: string;
  userAgent: string;
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
    const flow = tuple._2._1;
    const uaList = tuple._2._2;
    const usingUA = uaList[Math.round((uaList.length - 1) * Math.random())].value;
    console.log(`usingUA : ${usingUA}`);

    const currentProcessCheck = this.currentFlow.every(t => !(url === t._1 && JSON.stringify(flow) === JSON.stringify(t._2)));
    if (!currentProcessCheck) return;

    this.currentFlow.push(tuple);

    const htdId = flow[0].id.split('#')[0];
    const id = this.createWindow(event, url, htdId, usingUA);

    BrowsingExecutor.executeBrowsing(this.manageObj.get(id), flow)
    .then(() => {
      // console.log('終了！');
      Sender.sendBrowsingPVEvent(event, htdId);
      // ToDo あとで消す
      this.finishBrowsing(tuple, id);
    })
    .catch(() => {
      Sender.sendBrowsingPVErrorEvent(event, htdId);
      this.finishBrowsing(tuple, id);
    });
  }

  /**
    @param tuple {Tuple(url: String, action: Action)}
  */
  activateSimulate(event, tuple): void {
    const url = tuple._1;
    // const action = tuple._2;
    const action = tuple._2._1;
    const htdId = action.id.split('#')[0];

    const uaList = tuple._2._2;
    const usingUA = uaList[Math.round((uaList.length - 1) * Math.random())].value;
    console.log(`usingUA In Simulating : ${usingUA}`);

    const id = this.createWindow(event, url, htdId, usingUA);
    BrowsingExecutor.activateSimulate(this.manageObj.get(id), action);
  }

  createWindow(event, url, htdId, userAgent=''): number {
    let win = new BrowserWindow({
      // nodeIntegration: 'iframe',
      // webPreferences: { webSecurity: false, devTools: false },
      webPreferences: { webSecurity: false, devTools: true, disableBlinkFeatures: 'BlockCredentialedSubresources', },
      frame: false,
      width: 1500,
      height: 900,
    });

    let extraHeaders = '';
    // if (url === 'http://192.168.12.1/index.html') extraHeaders =  'Authorization: Basic Om5ldy15YW1haGE=';

    win.loadURL(url, { userAgent, extraHeaders });

    win.on('closed', () => {
      win = null;
    });

    this.registerManageObj(win.id, { win ,event, htdId, userAgent });
    this.deleteCookiesAsy(win.id);
    return win.id;
  }

  registerManageObj(id: number, obj: BrowsingManagedObject) {
    this.manageObj.set(id, obj);
  }

  deleteCookiesAsy(id: number): void {
    console.log(`this.manageObj.get(id).userAgent: ${this.manageObj.get(id).userAgent}`);
    this.manageObj.get(id).win.webContents.session.cookies.get({}, (error, cookies) => {
      // console.log('win.webContents.session.cookies', cookies);
      cookies.forEach(cookie => {
        const protocol = cookie.secure ? 'https://' : 'http://';
        const www = cookie.domain.charAt(0) === '.' ?
          cookie.domain.includes('.doubleclick.net') ? 'googleads.g' : 'www'
          : '';
        const domain = cookie.domain;
        const path = cookie.path;
        const url = `${protocol}${www}${domain}${path}`;
        try {
          this.manageObj.get(id).win.webContents.session.cookies.remove(url, cookie.name, error => {
            console.error(error);
            // console.log(`delete: ${cookie.name}: ${url}`);
          });
        } catch (e) {
          console.log('Browsingをしていないため、cookieの削除ができなかった。');
          console.log(e);
        }
      });
    });
  }

  finishBrowsing(tuple, id) {
    this.currentFlow = this.currentFlow.filter(t => !(tuple._1 === t._1 && JSON.stringify(tuple._2) === JSON.stringify(t._2)));
    this.closeWindow(id);
  }

  closeWindow(id): void {
    if (id === undefined) return;
    this.manageObj.get(id).win.destroy();
    this.manageObj.delete(id);
  }

  resetBrowsing(): void {
    console.log(`this.currentFlow: ${JSON.stringify(this.currentFlow)}`, `this.manageObj: ${JSON.stringify(this.manageObj)}`);
    Array.from(this.manageObj.keys()).forEach(id => this.closeWindow(id));
    this.currentFlow = this.currentFlow.filter(f => !f);
    console.log('currentFlow is resetted!!!', this.currentFlow);
  }

}

export default class IPCForBrowsingObject {
  static apply(): IPCForBrowsing {
    return new IPCForBrowsing();
  }
};
