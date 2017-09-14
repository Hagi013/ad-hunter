/* eslint-disable */
const config = {
  CLICK: 'executeClick',
  SCROLL: 'executeScroll',
};

const HuntedSettingService = class {

  static actionToStr(EVENT) {
    return this[config[EVENT]].toString().replace(/\w*\(\)\s?\{/, '').replace(/}$/,'').replace(/CONFIG\.\w*\.FROMRENDERER/, `'${CONFIG[EVENT].FROMRENDERER}'`).trim();
  }

  static executeClick() {
    // const ipcRenderer = require('electron').ipcRenderer;

    window.addEventListener('click', (event) => {
      const res = {
        eventX: event.x,
        eventY: event.y,
        eventId: event.target.id,
        eventClass: event.target.className,
        eventDOM: event.target,
        eventHTML: event.target.innerHTML
      };
      // ipcRenderer.send(CONFIG.CLICK.FROMRENDERER, res);
    });
  }

  static executeScroll() {
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
