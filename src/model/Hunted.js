import moment from 'moment';
import BaseModel from './BaseModel';
import { ActionObject } from './Action';
import { SettingsObject } from './Settings';
import { UserAgentObject } from './UserAgent';
import HuntedRepository from '../lib/repository/HuntedRepository';
import { notEmptyCheck, arrayCheck, emptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';
import Try from '../lib/Try';
import ResultClass from '../lib/tuple/Result';
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

  static createBrowsingTuple(hunted, idx) {
    if (notEmptyCheck(idx)) {
      const SimulateTupleType = new Tuple(String, ActionObject.apply().constructor);
      return new SimulateTupleType(hunted.url, ActionObject.apply(hunted.flow[idx]));
    }
    const BrowsingSetType = new Tuple(Array, Array);
    const ExecuteBrowsingTupleType = new Tuple(String, BrowsingSetType);
    return new ExecuteBrowsingTupleType(hunted.url,
      new BrowsingSetType(HuntedObject.apply(hunted).flow, UserAgentObject.getAll()));
  }

  static save(hunted) {
    if (emptyCheck(hunted)) return null;
    const savingHunted = Try.apply(() => this.createItemForSave(hunted));

    if (savingHunted.isFailure()) return new ResultClass('Exception', `Hunted CreateItemForSave failed!! ${savingHunted}`);

    const result = Try.apply(() => HuntedRepository.upsert(savingHunted.get()));
    if (result.isFailure()) return new ResultClass('Exception', `HuntedRepository.upsert failed!! ${result}`);

    return new ResultClass('Success', 'Save Successed');
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

  static getAll() {
    const fromStorage = Try.apply(() => HuntedRepository.findAll());
    if (fromStorage.isFailure()) return new ResultClass('Exception', `HuntedRepository.findAll failed!! ${JSON.stringify(fromStorage)}`);

    const triedHunted = Try.apply(() => fromStorage.get().map(h => this.apply(h)));
    if (triedHunted.isFailure()) return new ResultClass('Exception', `HuntedObject.apply failed!! ${JSON.stringify(triedHunted)}`);

    if (triedHunted.isSuccess()) return triedHunted.get();
    return ResultClass('Exception', 'getAll failed');
  }

  static getById(id) {
    const fromStorage = Try.apply(() => HuntedRepository.findById(id));
    if (fromStorage.isFailure()) return new ResultClass('Exception', `HuntedRepository.findById failed!! ${JSON.stringify(fromStorage)}`);

    const triedHunted = Try.apply(() => this.apply(fromStorage.get()));
    if (triedHunted.isFailure()) return new ResultClass('Exception', `HuntedObject.apply failed!! ${JSON.stringify(triedHunted)}`);

    if (triedHunted.isSuccess()) return triedHunted.get();
    return new ResultClass('Exception', 'getById failed');
  }

  static remove(id) {
    const htdById = Try.apply(() => HuntedRepository.findById(id));
    if (htdById.isFailure()) return new ResultClass('Exception', `HuntedRepository.findById failed!! ${JSON.stringify(htdById)}`);

    const res = Try.apply(() => HuntedRepository.remove(id));
    if (res.isFailure()) return new ResultClass('Exception', `HuntedRepository.remove failed!! ${JSON.stringify(res)}`);
    return new ResultClass('Exception', 'remove failed');
  }
}
