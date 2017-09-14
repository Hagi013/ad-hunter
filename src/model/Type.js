import BaseModel from './BaseModel';
import * as processType from './type/HuntedActionType';
import { notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';


export default class Type extends BaseModel {
  constructor(data) {
    super();

    this.id = notEmptyCheck(data.id) ? data.id : '';
    this.process = notEmptyCheck(data.process) && processType.processCheck(data.process) ? data.process : '';
  }
}

export class TypeObject {
  static apply(obj) {
    if (notEmptyObjCheck(obj)) {
      return new Type(obj);
    }
    return new Type(this.createItem());
  }

  static createItem() {
    return {
      id: '',
      process: '',
    };
  }
}
