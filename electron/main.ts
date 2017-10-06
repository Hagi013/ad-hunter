/* eslint-disable */
import ElectronObject from './model/Electron';
import IPCForSettingObject from './model/IPCForSetting';
import IPCForBrowsingObject from './model/IPCForBrowsing';

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

const ipcForSetting = IPCForSettingObject.apply();
ipcForSetting.start();

const ipcForBrowsing = IPCForBrowsingObject.apply();
ipcForBrowsing.start();
