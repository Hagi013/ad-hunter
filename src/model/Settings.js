import moment from 'moment';
import BaseModel from './BaseModel';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';

export default class Settings extends BaseModel {
  constructor(data) {
    super();

    this.pv = notEmptyCheck(data.pv) ? Number(data.pv) : '';
    this.timeOut = notEmptyCheck(data.timeOut) ? data.timeOut : '';
    this.interval = notEmptyCheck(data.interval) ? Number(data.interval) : '';
    this.start = notEmptyCheck(data.start) ? Number(moment(data.start).format('x')) : '';
    this.stop = notEmptyCheck(data.stop) ? Number(moment(data.stop).format('x')) : '';
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
      interval: '',
      start: '',
      stop: '',
    };
  }

  static createItemForSave(setting) {
    return this.apply(setting);
  }
}
