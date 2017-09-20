import BaseModel from './BaseModel';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';

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
}
