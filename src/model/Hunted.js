/* eslint-disable consistent-return */
import moment from 'moment';
import BaseModel from './BaseModel';
import { ActionObject } from './Action';
import { SettingsObject } from './Settings';
import HuntedRepository from '../lib/repository/HuntedRepository';
import { notEmptyCheck, arrayCheck, emptyCheck, notEmptyObjCheck } from '../lib/utils/CheckUtils';
import Try from '../lib/Try';
import ResultClass from '../lib/tuple/Result';
import Exception from '../lib/Exception';

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

  static save(hunted) {
    if (emptyCheck(hunted)) return;
    const savingHunted = Try.apply(this.createItemForSave(hunted));

    if (savingHunted.isFailure()) return ResultClass('Exception', `Hunted CreateItemForSave failed!! ${savingHunted}`);

    const result = Try.apply(HuntedRepository.upsert(savingHunted.get()));
    if (result.isFailure()) return ResultClass('Exception', `HuntedRepository.upsert failed!! ${result}`);

    return ResultClass('Success', 'Save Successed');
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
    const fromStorage = Try.apply(HuntedRepository.findAll());
    if (fromStorage.isFailure()) return ResultClass('Exception', `HuntedRepository.findAll failed!! ${fromStorage}`);

    const triedHunted = Try.apply(fromStorage.get().map(h => this.apply(h)));
    if (fromStorage.isFailure()) return ResultClass('Exception', `HuntedObject.apply failed!! ${triedHunted}`);

    if (triedHunted.isSuccess()) return triedHunted.get();
    return ResultClass('Exception', 'getAll failed');
  }

  static getById(id) {
    const fromStorage = Try.apply(HuntedRepository.findById(id));
    if (fromStorage.isFailure()) return ResultClass('Exception', `HuntedRepository.findById failed!! ${fromStorage}`);

    const triedHunted = Try.apply(this.apply(fromStorage.get()));
    if (fromStorage.isFailure()) return ResultClass('Exception', `HuntedObject.apply failed!! ${triedHunted}`);

    if (triedHunted.isSuccess()) return triedHunted.get();
    return ResultClass('Exception', 'getById failed');
  }
}
