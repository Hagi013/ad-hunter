import BaseModel from './BaseModel';
import UserAgentRepository from '../lib/repository/UserAgentRepository';
import Try from '../lib/Try';
import ResultClass from '../lib/tuple/Result';
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

export class UserAgentObject {
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

  static save(ua) {
    if (emptyCheck(ua)) return null;
    const savingUA = Try.apply(() => this.createItemForSave(ua));

    if (savingUA.isFailure()) return new ResultClass('Exception', `UserAgent CreateItemForSave failed!! ${savingUA}`);

    const result = Try.apply(() => UserAgentRepository.upsert(savingUA.get()));
    if (result.isFailure()) return new ResultClass('Exception', `HuntedRepository.upsert failed!! ${result}`);

    return new ResultClass('Success', 'Save Successed');
  }

  static createItemForSave(ua) {
    const forSaving = {
      id: ua.id,
      label: ua.label,
      value: ua.value,
    };
    this.valodateCheck(forSaving);
    return this.apply(forSaving);
  }

  static valodateCheck(obj) {
    if (emptyCheck(obj.id)) throw new Exception('Id is not setted');
    if (emptyCheck(obj.label)) throw new Exception('Label is not setted');
    if (emptyCheck(obj.value)) throw new Exception('Value is not setted');
  }

  static getAll() {
    const fromStorage = Try.apply(() => UserAgentRepository.findAll());
    if (fromStorage.isFailure()) return new ResultClass('Exception', `UserAgentRepository.findAll failed!! ${JSON.stringify(fromStorage)}`);

    const triedUA = Try.apply(() => fromStorage.get().map(h => this.apply(h)));
    if (triedUA.isFailure()) return new ResultClass('Exception', `UserAgentObject.apply failed!! ${JSON.stringify(triedUA)}`);

    if (triedUA.isSuccess()) return triedUA.get();
    return ResultClass('Exception', 'getAll failed');
  }

  static getById(id) {
    const fromStorage = Try.apply(() => UserAgentRepository.findById(id));
    if (fromStorage.isFailure()) return new ResultClass('Exception', `UserAgentRepository.findById failed!! ${JSON.stringify(fromStorage)}`);

    const triedUA = Try.apply(() => this.apply(fromStorage.get()));
    if (triedUA.isFailure()) return new ResultClass('Exception', `UserAgentObject.apply failed!! ${JSON.stringify(triedUA)}`);

    if (triedUA.isSuccess()) return triedUA.get();
    return new ResultClass('Exception', 'getById failed');
  }

  static remove(id) {
    const uaById = Try.apply(() => UserAgentRepository.findById(id));
    if (uaById.isFailure()) return new ResultClass('Exception', `UserAgentRepository.findById failed!! ${JSON.stringify(uaById)}`);

    const res = Try.apply(() => UserAgentRepository.remove(id));
    if (res.isFailure()) return new ResultClass('Exception', `HuntedRepository.remove failed!! ${JSON.stringify(res)}`);
    return new ResultClass('Exception', 'remove failed');
  }
}
