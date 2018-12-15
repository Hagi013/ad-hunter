import moment from 'moment';
import BaseModel from './BaseModel';
import BaseStoreModel from './DataStoreModel';
import { ActionObject } from './Action';
import { SettingsObject } from './Settings';
import { UserAgentObject } from './UserAgent';
import HuntedRepository from '../lib/repository/HuntedRepository';
import { notEmptyCheck, arrayCheck, emptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';
import Exception from '../lib/Exception';
import Tuple from '../lib/Tuple';

export default class Hunted extends BaseModel {
  constructor(data) {
    super();
    this.id = notEmptyCheck(data.id) ? data.id : '';
    this.url = notEmptyCheck(data.url) ? data.url : '';
    this.flow = arrayCheck(data.flow) ? data.flow.map(f => ActionObject.apply(f)) : [];
    this.updatedAt = notEmptyCheck(data.updatedAt) ? Number(data.updatedAt) : '';
    this.settings = SettingsObject.apply(data.settings);
    this.description = notEmptyCheck(data.description) ? data.description : '';
  }
}

export class HuntedObject extends BaseStoreModel {

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

  static createBrowsingTuple(hunted, idx) {
    if (notEmptyCheck(idx)) {
      // const SimulateTupleType = new Tuple(String, ActionObject.apply().constructor);
      const SimulatingSetType = new Tuple(ActionObject.apply().constructor, Array);
      const SimulateTupleType = new Tuple(String, SimulatingSetType);
      // return new SimulateTupleType(hunted.url, ActionObject.apply(hunted.flow[idx]));
      return new SimulateTupleType(hunted.url,
        new SimulatingSetType(ActionObject.apply(hunted.flow[idx]), UserAgentObject.getAll()));
    }
    const BrowsingSetType = new Tuple(Array, Array);
    const ExecuteBrowsingTupleType = new Tuple(String, BrowsingSetType);
    return new ExecuteBrowsingTupleType(hunted.url,
      new BrowsingSetType(HuntedObject.apply(hunted).flow, UserAgentObject.getAll()));
  }

  static createItemForSave(hunted) {
    const forSaving = {
      id: hunted.id,
      url: hunted.url,
      flow: hunted.flow.map(action => ActionObject.createItemForSave(action)),
      updatedAt: moment().format('x'),
      settings: SettingsObject.createItemForSave(hunted.settings),
      description: hunted.description,
    };
    this.validateCheck(forSaving);
    return this.apply(forSaving);
  }

  static validateCheck(obj) {
    if (emptyCheck(obj.id)) throw new Exception('Id is not setted');
    if (emptyCheck(obj.url)) throw new Exception('URL is not setted');
    if (emptyCheck(obj.updatedAt)) throw new Exception('UpdatedAt is not setted');
  }

  static repository() { return HuntedRepository; }

}
