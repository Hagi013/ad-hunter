/* eslint-disable object-shorthand,import/extensions,import/no-unresolved,no-underscore-dangle,max-len */
import { ipcRenderer } from 'electron';
import CONFIG from '../../../mapper/ElectronIterfaceMapper.json';

export default class ElectronClient {

  static searchItem(tuple, func) {
    ipcRenderer.send(CONFIG.SETTING.CLICK.FROMVUE, tuple);
    ipcRenderer.on(CONFIG.SETTING.CLICK.TOVUE, func);
  }

  static scrollScreen(tuple, func) {
    ipcRenderer.send(CONFIG.SETTING.SCROLL.FROMVUE, tuple);
    ipcRenderer.on(CONFIG.SETTING.SCROLL.TOVUE, func);
  }

  static simulateAction(tuple) {
    ipcRenderer.send(CONFIG.BROWSING.SIMULATE.FROMVUE, tuple);
    // ipcRenderer.on(CONFIG.SCROLL.TOVUE, func);
  }

  static executeBrowsing(tuple, func) {
    ipcRenderer.send(CONFIG.BROWSING.EXECUTE.FROMVUE, tuple);
    ipcRenderer.on(CONFIG.BROWSING.EXECUTE.TOVUE, func);
  }
}
