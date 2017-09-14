import BaseModel from './BaseModel';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';

export default class Settings extends BaseModel {
  constructor(data) {
    super();

    this.pv = notEmptyCheck(data.pv) ? data.pv : '';
    this.timeOut = notEmptyCheck(data.timeOut) ? data.timeOut : '';
    this.ctr = notEmptyCheck(data.ctr) ? data.ctr : '';
    this.start = notEmptyCheck(data.start) ? data.start : '';
    this.stop = notEmptyCheck(data.stop) ? data.stop : '';
  }
}

export class SettingsObject {
  static apply(obj) {
    if (notEmptyObjCheck(obj)) return new Settings(obj);
    return new Settings(this.createItem());
  }

  static createItem() {
    return {
      pv: '',
      timeOut: '',
      ctr: '',
      start: '',
      stop: '',
    };
  }
}
