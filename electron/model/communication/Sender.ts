const CONFIG = require('../../../mapper/ElectronIterfaceMapper.json').BROWSING;

type SendData = {
  type: string,
  htdId: string
}

export default class Sender {
  static sendBrowsingClickEvent(event, htdId: string) {
    const sendData = this.createSendData('CLICKED!!', htdId);
    this.sendEvent(event, sendData);
  }

  static sendBrowsingPVEvent(event, htdId: string) {
    const sendData = this.createSendData('PV', htdId);
    this.sendEvent(event, sendData);
  }

  static sendBrowsingPVErrorEvent(event, htdId: string) {
    const sendData = this.createSendData('PVERROR!', htdId);
    this.sendEvent(event, sendData);
  }

  private static sendEvent(event, sendData: SendData) {
    event.sender.send(CONFIG['EXECUTE']['TOVUE'], sendData);
  }

  private static createSendData(type: string, htdId: string): SendData {
    return {
      type,
      htdId
    };
  }
}
