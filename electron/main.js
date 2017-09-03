const { app, BrowserWindow, ipcMain } = require('electron');
const util = require('util');
const fs = require('fs');
const path = require('path');
const url = require('url');

class Electron {
  constructor() {
    this.win = '';
  }
  start() {
    console.log(__dirname, path.resolve(__dirname, '../dist/index.html'));
    this.win = new BrowserWindow({ width: 1500, height: 900 });
    this.win.loadURL(url.format({
      //react-scrpitでビルドされるファイルをロードする
      pathname: path.resolve(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
    // デバッグツールはデフォルトOFF.
    this.win.webContents.openDevTools()
    this.win.on('closed', () => {
      this.win = null
    });
  }
}

const readFileAsync = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, {
      encoding: 'utf8',
    }, (err, elm) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(elm);
    })
  })
}

const electron = new Electron();

if (process.env.NODE_ENV !== 'production') {
  // Install `electron-debug` with `devtron`
  require('electron-debug')({ showDevTools: true })

  // Install `vue-devtools`
  const { default: installExtension, VUEJS_DEVTOOLS} = require('electron-devtools-installer');
  console.log('aaaa');
  installExtension(VUEJS_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    });
}

app.on('ready', electron.start);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (electron.win === null) {
    electron.start();
  }
});

ipcMain.on('crawlExec', (event, target) => {
  console.log('this is main ipc', target, app.getPath('userData'), process.version);
  const fileName = path.join(app.getPath('userData'), 'Local Storage/file__0.localstorage');
  // const a = JSON.parse(fs.readFileSync(fileName));
  console.log(fs.readFileSync(fileName), fs.readFileSync(path.join(`${app.getPath('userData')}`, `${path.basename('now', '.json')}.json`)));
  readFileAsync(fileName)
    .then(elm => {
      console.log('elm', elm, elm.toString());
      const tmpWindow = new BrowserWindow({ width: 1000, height: 700 });
      tmpWindow.loadURL(url.format({
        //react-scrpitでビルドされるファイルをロードする
        pathname: path.resolve(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));

      event.returnValue = `${target} OK Comming!`;

  })
    .catch(e => console.error(e));

});

