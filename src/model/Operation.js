import BaseModel from './BaseModel';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';
import Exception from '../lib/Exception';

export default class Operation extends BaseModel {

  constructor(data) {
    super();
    this.opType = notEmptyCheck(data.opType) ? data.opType : '';
    this.num = notEmptyCheck(data.num) ? Number(data.num) : 0;
    this.funcStr = notEmptyCheck(data.funcStr) ? data.funcStr : '';
  }
}


export class OperationObject {
  static apply(obj) {
    if (notEmptyObjCheck(obj)) {
      return new Operation(obj);
    }
    return new Operation(this.createItem());
  }

  static createItem() {
    return {
      opType: '',
      num: '',
      funcStr: '',
    };
  }

  static createItemForSave(op) {
    this.validateCheck(op);
    return this.apply(op);
  }

  static validateCheck(obj) {
    if (notEmptyCheck(obj.num) && Number(obj.num) < 0) throw new Exception('Operation number must be greater than or equal to 0.');
  }
}
