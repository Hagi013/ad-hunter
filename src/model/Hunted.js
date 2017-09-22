import BaseModel from './BaseModel';
import { ActionObject } from './Action';
import { SettingsObject } from './Settings';
import { notEmptyCheck, arrayCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';


export default class Hunted extends BaseModel {
  constructor(data) {
    super();
    this.id = notEmptyCheck(data.id) ? data.id : '';
    this.url = notEmptyCheck(data.url) ? data.url : '';
    this.flow = arrayCheck(data.flow) ? data.flow.map(f => ActionObject.apply(f)) : [];
    this.updatedAt = notEmptyCheck(data.updatedAt) ? data.updatedAt : '';
    this.settings = notEmptyCheck(data.settings) ? SettingsObject.apply(data.settings) : '';
    this.description = notEmptyCheck(data.description) ? data.description : '';
  }
}

export class HuntedObject {

  static apply(obj) {
    if (notEmptyObjCheck(obj)) {
      return new Hunted(obj);
    }
    return new Hunted(this.createItem());
  }

  static createItem() {
    return {
      id: '',
      url: '',
      flow: '',
      updatedAt: '',
      settings: '',
      description: '',
    };
  }

}
