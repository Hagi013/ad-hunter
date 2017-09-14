import BaseModel from './BaseModel';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';

export default class Item extends BaseModel {

  constructor(data) {
    super();
    this.eventX = notEmptyCheck(data.eventX) ? data.eventX : '';
    this.eventY = notEmptyCheck(data.eventY) ? data.eventY : '';
    this.eventId = notEmptyCheck(data.eventId) ? data.eventId : '';
    this.eventClass = notEmptyCheck(data.eventClass) ? data.eventClass : '';
    this.eventDOM = notEmptyCheck(data.eventDOM) ? data.eventDOM : '';
    this.eventHTML = notEmptyCheck(data.eventHTML) ? data.eventHTML : '';
  }
}


export class ItemObject {
  static apply(obj) {
    if (notEmptyObjCheck(obj)) {
      return new Item(obj);
    }
    return new Item(this.createItem());
  }

  static createItem() {
    return {
      eventX: '',
      eventY: '',
      eventId: '',
      eventClass: '',
      eventDOM: '',
      eventHTML: '',
    };
  }
}
