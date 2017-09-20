/* eslint-disable */
const config = {
  CLICK: 'prepareClick',
  SCROLL: 'executeScroll',
};

const actionConfig = {
  CLICK: 'item',
  SCROLL: 'scroll',
  OPERATION: 'operation',

}

// const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').BROWSING;

const HuntedBrowsingService = class {

  static actionToStr(action) {
    return this[config[action.type]](action[actionConfig[action.type]]).toString().replace(/\(\w*\)\s?\=\>\s?\{/, '').replace(/point/, JSON.stringify(action[actionConfig[action.type]])).replace(/}$/,'').trim();
  }

  static prepareClick(point) {
    return () => {
      const data = point;
      const pageXOffset = data.pageXOffset;
      const pageYOffset = data.pageYOffset;
      window.scrollTo(pageXOffset, pageYOffset);
      const res = JSON.stringify({availX: window.screenX, availY: window.screenY});
      `${res}`;
    }
  }

  // static prepareClickFromId(id) {
  //   const id = document.getElementById(id);
  //   id.scrollIntoView(true);
  //   id.click();
  // }
  //
  // static prepareClickFromClass(className) {
  //   const classElem = document.getElementsByClassName(className)[0];
  //   classElem.scrollIntoView(true);
  //   classElem.click();
  // }
  //
  // static prepareClickFromPoint(windowInfo) {
  //   document.elementFromPoint(windowInfo.x, windowInfo.y);
  //   window.getElement
  // }

  static executeScroll(point) {
    return () => {
      // const ipcRenderer = require('electron').ipcRenderer;
      const data = point;
      const pageX = data.pageX;
      const pageY = data.pageY;
      window.scrollTo(pageX, pageY);

      // ipcRenderer.send(CONFIG.CLICK.FROMRENDERER, res);
    }
  }

  static inspectContent(content) {
    if (content.pageX !== '' && content.pageY !== '') {

    }
  }

}

module.exports = HuntedBrowsingService;
