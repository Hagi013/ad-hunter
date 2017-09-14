import BaseModel from './BaseModel';
import { TypeObject } from './Type';
import { ItemObject } from './Item';
import { ScrollObject } from './Scroll';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';

export default class Action extends BaseModel {
  constructor(data) {
    super();

    this.id = notEmptyCheck(data.id) ? data.id : '';
    this.type = notEmptyCheck(data.type) ? TypeObject.apply(data.type) : '';
    this.item = notEmptyCheck(data.item) ? ItemObject.apply(data.item) : '';
    this.scroll = notEmptyCheck(data.scroll) ? ScrollObject.apply(data.scroll) : '';
    this.operation = notEmptyCheck(data.operation) ? data.operation : '';
    this.ctr = notEmptyCheck(data.ctr) ? data.ctr : '';
  }
}

export class ActionObject {

  static apply(obj) {
    if (notEmptyObjCheck(obj)) {
      return new Action(obj);
    }
    return new Action(this.createItem());
  }

  static createItem() {
    return {
      id: '',
      type: '',
      item: '',
      scroll: '',
      ctr: '',
      operation: '',
    };
  }

}
