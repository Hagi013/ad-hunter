import BaseModel from './BaseModel';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';

export default class Scroll extends BaseModel {

  constructor(data) {
    super();
    this.pageX = notEmptyCheck(data.pageX) ? data.pageX : '';
    this.pageY = notEmptyCheck(data.pageY) ? data.pageY : '';
    this.eventId = notEmptyCheck(data.eventId) ? data.eventId : '';
    this.eventClass = notEmptyCheck(data.eventClass) ? data.eventClass : '';
    this.eventDOM = notEmptyCheck(data.eventDOM) ? data.eventDOM : '';
    this.eventHTML = notEmptyCheck(data.eventHTML) ? data.eventHTML : '';
  }
}


export class ScrollObject {
  static apply(obj) {
    if (notEmptyObjCheck(obj)) {
      return new Scroll(obj);
    }
    return new Scroll(this.createItem());
  }

  static createItem() {
    return {
      pageX: '',
      pageY: '',
      eventId: '',
      eventClass: '',
      eventDOM: '',
      eventHTML: '',
    };
  }
}
