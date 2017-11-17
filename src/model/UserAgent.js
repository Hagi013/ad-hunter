/* eslint-disable max-len */
import BaseModel from './BaseModel';
import DataStoreModel from './DataStoreModel';
import UserAgentRepository from '../lib/repository/UserAgentRepository';
import Exception from '../lib/Exception';

import { emptyCheck, notEmptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';


export default class UserAgent extends BaseModel {
  constructor(data) {
    super();
    this.id = notEmptyCheck(data.id) ? data.id : '';
    this.label = notEmptyCheck(data.label) ? data.label : '';
    this.value = notEmptyCheck(data.value) ? data.value : '';
  }
}

export class UserAgentObject extends DataStoreModel {
  static apply(obj) {
    return notEmptyObjCheck(obj) ? new UserAgent(obj) : new UserAgent(this.createItem());
  }

  static createItem() {
    return {
      id: '',
      label: '',
      value: '',
    };
  }

  static createItemForSave(ua) {
    const forSaving = {
      id: ua.id,
      label: ua.label,
      value: ua.value,
    };
    this.validateCheck(forSaving);
    return this.apply(forSaving);
  }

  static validateCheck(obj) {
    if (emptyCheck(obj.id)) throw new Exception('Id is not setted');
    if (emptyCheck(obj.label)) throw new Exception('Label is not setted');
    if (emptyCheck(obj.value)) throw new Exception('Value is not setted');
  }

  static repository() { return UserAgentRepository; }

}
