/* eslint-disable */
const config = {
  CLICK: 'clickEventListener',
  SCROLL: 'scrollEventListener',
};
const CONFIG = require('../../mapper/ElectronIterfaceMapper.json');

const HuntedSettingService = class {

  static actionToStr(EVENT) {
    return this[config[EVENT]].toString().replace(/\w*\(\)\s?\{/, '').replace(/}$/,'').replace(/CONFIG\.\w*\.FROMRENDERER/, `'${CONFIG[EVENT].FROMRENDERER}'`).trim();
  }

  static clickEventListener() {
    const ipcRenderer = require('electron').ipcRenderer;
    window.addEventListener('click', (event) => {
      const res = {
        eventX: event.x,
        eventY: event.y,
        eventId: event.target.id,
        eventClass: event.target.className,
        eventDOM: event.target,
        eventHTML: event.target.innerHTML
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
        eventId: event.target.id,
        eventClass: event.target.className,
        eventDOM: event.target,
        eventHTML: event.target.innerHTML
      };
      ipcRenderer.send(CONFIG.CLICK.FROMRENDERER, res);
    });
  }
}

module.exports = HuntedSettingService;
