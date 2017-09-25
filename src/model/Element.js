import BaseModel from './BaseModel';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';

export default class Element extends BaseModel {

  constructor(data) {
    super();
    this.pageXOffset = notEmptyCheck(data.pageXOffset) ? Number(data.pageXOffset) : '';
    this.pageYOffset = notEmptyCheck(data.pageYOffset) ? Number(data.pageYOffset) : '';
    this.x = notEmptyCheck(data.x) ? Number(data.x) : '';
    this.y = notEmptyCheck(data.y) ? Number(data.y) : '';
    this.pageX = notEmptyCheck(data.pageX) ? Number(data.pageX) : '';
    this.pageY = notEmptyCheck(data.pageY) ? Number(data.pageY) : '';
    this.eventId = notEmptyCheck(data.eventId) ? data.eventId : '';
    this.eventClass = notEmptyCheck(data.eventClass) ? data.eventClass : '';
    // this.eventDOM = notEmptyCheck(data.eventDOM) ? data.eventDOM : '';
    // this.eventHTML = notEmptyCheck(data.eventHTML) ? data.eventHTML : '';
  }

}


export class ElementObject {
  static apply(obj) {
    if (notEmptyObjCheck(obj)) {
      return new Element(obj);
    }
    return new Element(this.createItem());
  }

  static createItem() {
    return {
      pageXOffset: '',
      pageYOffset: '',
      x: '',
      y: '',
      pageX: '',
      pageY: '',
      eventId: '',
      eventClass: '',
      // eventDOM: '',
      // eventHTML: '',
    };
  }

  static createItemForSave(elem) {
    return this.apply(elem);
  }

}
