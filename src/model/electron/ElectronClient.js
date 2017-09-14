import { ipcRenderer } from 'electron';
import CONFIG from '../../../mapper/ElectronIterfaceMapper.json';

export default class ElectronClient {

  static searchItem(url, func) {
    ipcRenderer.send(CONFIG.CLICK.FROMVUE, url);
    ipcRenderer.on(CONFIG.CLICK.TOVUE, func);
  }

  static scrollScreen(url, func) {
    ipcRenderer.send(CONFIG.SCROLL.FROMVUE, url);
    ipcRenderer.on(CONFIG.SCROLL.TOVUE, func);
  }
}
