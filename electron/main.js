/* eslint-disable */
const { BrowserWindow, ipcMain } = require('electron');
const ElectronObject = require('./model/Electron');
const IPCMainObject = require('./model/IPCMain');
// const HuntedSettingService = require('./service/HuntedSettingService');


const electron = ElectronObject.apply();

if (process.env.NODE_ENV !== 'production') {
  // Install `electron-debug` with `devtron`
  require('electron-debug')({ showDevTools: true });

  // Install `vue-devtools`
  const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');
  installExtension(VUEJS_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch((err) => {
      console.log('Unable to install `vue-devtools`: \n', err);
    });
}

electron.start();

const ipc = IPCMainObject.apply();
ipc.start();

ipcMain.on('crawlExec', (event, target) => {
  const tmpWindow = new BrowserWindow({ width: 1000, height: 700 });
  tmpWindow.loadURL('http://labs.gree.jp/blog/2013/12/9354/');
  event.sender.send('fromParent', `${target} OK Comming1!${tmpWindow.id}`);
});

