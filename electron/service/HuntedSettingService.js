/* eslint-disable */
const config = {
  CLICK: 'clickEventListener',
  SCROLL: 'scrollEventListener',
};
const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').SETTING;

const HuntedSettingService = class {

  static actionToStr(EVENT) {
    return this[config[EVENT]].toString().replace(/\w*\(\)\s?\{/, '').replace(/}$/,'').replace(/CONFIG\.\w*\.FROMRENDERER/, `'${CONFIG[EVENT].FROMRENDERER}'`).trim();
  }

  static clickEventListener() {
    const ipcRenderer = require('electron').ipcRenderer;
    window.addEventListener('click', (event) => {
      const res = {
        pageXOffset: window.pageXOffset,
        pageYOffset: window.pageYOffset,
        x: event.x,
        y: event.y,
        pageX: event.pageX,
        pageY: event.pageY,
        eventId: document.elementFromPoint(event.x, event.y).id,
        eventClass: document.elementFromPoint(event.x, event.y).className,
        // eventDOM: event.target,
        // eventHTML: event.target.innerHTML
      };
      ipcRenderer.send(CONFIG.CLICK.FROMRENDERER, res);
    });
  }

  static scrollEventListener() {
    const ipcRenderer = require('electron').ipcRenderer;
    window.addEventListener('click', (event) => {
      const res = {
        pageX: event.pageX,
        pageY: event.pageY,
        eventId: document.elementFromPoint(event.x, event.y).id,
        eventClass: document.elementFromPoint(event.x, event.y).className,
        // eventDOM: event.target,
        // eventHTML: event.target.innerHTML
      };
      ipcRenderer.send(CONFIG.CLICK.FROMRENDERER, res);
    });
  }
}

module.exports = HuntedSettingService;
