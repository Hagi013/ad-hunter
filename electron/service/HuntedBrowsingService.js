/* eslint-disable */
const config = {
  CLICK: 'prepareClick',
  SCROLL: 'executeScroll',
  OPERATION: 'executeOperation',
};

const actionConfig = {
  CLICK: 'item',
  SCROLL: 'scroll',
  OPERATION: 'operation',
}

// const CONFIG = require('../../mapper/ElectronIterfaceMapper.json').BROWSING;

const HuntedBrowsingService = class {

  static actionToStr(action) {
    return this[config[action.type]](action[actionConfig[action.type]]).toString().replace(/\(\w*\)\s?\=\>\s?\{/, '').replace(/origin/, JSON.stringify(action[actionConfig[action.type]])).replace(/}$/,'').trim();
  }

  static prepareClick(origin) {
    let res;

    // 下記の関数はRendererプロセス内のグローバルな関数として定義されるため、同じFlowかつ同じページ内で複数回実行されると「has already been declared」エラーが発生するので、
    // 関数自体を無名関数で実行するようにした。
    return () => {
      (() => {
        const point = origin;
        const pageXOffset = point.pageXOffset;
        const pageYOffset = point.pageYOffset;
        window.scrollTo(pageXOffset, pageYOffset);
        res = JSON.stringify({availX: window.screenX, availY: window.screenY});
      })();
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

  static executeScroll(origin) {

    // 下記の関数はRendererプロセス内のグローバルな関数として定義されるため、同じFlowかつ同じページ内で複数回実行されると「has already been declared」エラーが発生するので、
    // 関数自体を無名関数で実行するようにした。
    return () => {
      (() => {

        // const ipcRenderer = require('electron').ipcRenderer;
        const point = origin;
        const pageX = point.pageX;
        const pageY = point.pageY;
        window.scrollTo(pageX, pageY);
        // ipcRenderer.send(CONFIG.CLICK.FROMRENDERER, res);
      })();
    }
  }

  static executeOperation(origin) {

    // 下記の関数はRendererプロセス内のグローバルな関数として定義されるため、同じFlowかつ同じページ内で複数回実行されると「has already been declared」エラーが発生するので、
    // 関数自体を無名関数で実行するようにした。
    return () => {
      (() => {

        // operationModule = {};

        const moment = require('moment');

        const wait = (num) => {
          const startTime = moment();
          let now = moment();
          while(now.diff(startTime) < num*1000) {
            console.log(startTime.diff(now), now.diff(startTime));
            now = moment();
          }
        };

        const operation = origin;
        const doMapper = {
          BACK: (num) => { window.history.go(-num); },
          FORWARD: (num) => { window.history.go(num); },
          WAIT: (num) => { wait(num); },
          CUSTOM: (funcStr) => { new Function(funcStr)(); },
        };

        const paramMapper = {
          BACK: 'num',
          FORWARD: 'num',
          WAIT: 'num',
          CUSTOM: 'funcStr',
        };

        doMapper[operation.opType](operation[paramMapper[operation.opType]]);
      })();
    }
  }
}

module.exports = HuntedBrowsingService;
