import BaseModel from './BaseModel';
import { ElementObject } from './Element';
import { OperationObject } from './Operation';
import { emptyCheck, notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';
import { actionTypeCheck } from './type/HuntedActionType';
import Exception from '../lib/Exception';

export default class Action extends BaseModel {
  constructor(data) {
    super();

    this.id = notEmptyCheck(data.id) ? data.id : '';
    this.type = notEmptyCheck(data.type) && actionTypeCheck(data.type) ? data.type : '';
    this.item = ElementObject.apply(data.item);
    this.scroll = ElementObject.apply(data.scroll);
    this.operation = OperationObject.apply(data.operation);
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

  static createItemForSave(action) {
    const forSaving = {
      id: action.id,
      type: action.type,
      item: ElementObject.createItemForSave(action.item),
      scroll: ElementObject.createItemForSave(action.scroll),
      ctr: action.ctr,
      operation: OperationObject.createItemForSave(action.operation),
    };
    this.validateCheck(forSaving);
    return this.apply(forSaving);
  }

  static validateCheck(obj) {
    if (emptyCheck(obj.id)) throw new Exception('Action must be set Id');
    if (emptyCheck(obj.type) && actionTypeCheck(obj.type)) throw new Exception('Action must be set type');
  }

}
