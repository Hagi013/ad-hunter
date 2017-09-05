import BaseModel from './BaseModel';
import Type from './Type';

export default class Flow extends BaseModel{
  constructor(data) {
    super();
    if (super.emptyCheck(data)) return;

    this.id = super.notEmptyCheck(data.id) ? data.id : '';
    this.type = super.notEmptyCheck(data.type) ? new Type(data.type) : '';
    this.item = super.notEmptyCheck(data.item) ? data.item : '';
    this.ctr = super.notEmptyCheck(data.ctr) ? data.ctr : '';
    this.scrollY = super.notEmptyCheck(data.scrollY) ? data.scrollY : '';
    this.scrollX = super.notEmptyCheck(data.scrollX) ? data.scrollX : '';
    this.wait = super.notEmptyCheck(data.wait) ? data.wait : '';
  }
}
