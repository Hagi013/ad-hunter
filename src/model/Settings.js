import BaseModel from './BaseModel';

export default class Settings extends BaseModel {
  constructor(data) {
    super();
    if (super.emptyCheck(data)) return;

    this.pv = super.notEmptyCheck(data.pv) ? data.pv : '';
    this.timeOut = super.notEmptyCheck(data.timeOut) ? data.timeOut : '';
    this.ctr = super.notEmptyCheck(data.ctr) ? data.ctr : '';
    this.start = super.notEmptyCheck(data.start) ? data.start : '';
    this.stop = super.notEmptyCheck(data.stop) ? data.stop : '';
  }
}
