import BaseModel from './BaseModel';
import { ElementObject } from './Element';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';
import { actionTypeCheck } from './type/HuntedActionType';

export default class Action extends BaseModel {
  constructor(data) {
    super();

    this.id = notEmptyCheck(data.id) ? data.id : '';
    this.type = notEmptyCheck(data.type) && actionTypeCheck(data.type) ? data.type : '';
    this.item = notEmptyCheck(data.item) ? ElementObject.apply(data.item) : '';
    this.scroll = notEmptyCheck(data.scroll) ? ElementObject.apply(data.scroll) : '';
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
