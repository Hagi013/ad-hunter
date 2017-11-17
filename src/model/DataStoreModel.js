import { emptyCheck } from '../lib/utils/CheckUtils';
import Try from '../lib/Try';
import ResultClass from '../lib/tuple/Result';
import Exception from '../lib/Exception';

export default class DataStoreModel {

  static apply() { throw new Exception('Not Implemented Error'); }

  static repository() { throw new Exception('Not Implemented Error'); }

  static save(obj) {
    if (emptyCheck(obj)) return null;
    const savingObj = Try.apply(() => this.createItemForSave(obj));

    if (savingObj.isFailure()) return new ResultClass('Exception', `Hunted CreateItemForSave failed!! ${savingObj}`);

    const result = Try.apply(() => this.repository().upsert(savingObj.get()));
    if (result.isFailure()) return new ResultClass('Exception', `HuntedRepository.upsert failed!! ${result}`);

    return new ResultClass('Success', 'Save Successed');
  }

  static createItemForSave(obj) {
    throw new Exception(`Not Implemented Error. This method recieved ${obj}`);
  }

  static getAll() {
    const fromStorage = Try.apply(() => this.repository().findAll());
    if (fromStorage.isFailure()) return new ResultClass('Exception', `${this.repository()}.findAll failed!! ${JSON.stringify(fromStorage)}`);

    const triedObj = Try.apply(() => fromStorage.get().map(h => this.apply(h)));
    if (triedObj.isFailure()) return new ResultClass('Exception', `${this}.apply failed!! ${JSON.stringify(triedObj)}`);

    if (triedObj.isSuccess()) return triedObj.get();
    return ResultClass('Exception', 'getAll failed');
  }

  static getById(id) {
    const fromStorage = Try.apply(() => this.repository().findById(id));
    if (fromStorage.isFailure()) return new ResultClass('Exception', `${this.repository()}.findById failed!! ${JSON.stringify(fromStorage)}`);

    const triedObj = Try.apply(() => this.apply(fromStorage.get()));
    if (triedObj.isFailure()) return new ResultClass('Exception', `${this}.apply failed!! ${JSON.stringify(triedObj)}`);

    if (triedObj.isSuccess()) return triedObj.get();
    return new ResultClass('Exception', 'getById failed');
  }

  static remove(id) {
    const objById = Try.apply(() => this.repository().findById(id));
    if (objById.isFailure()) return new ResultClass('Exception', `${this.repository()}.findById failed!! ${JSON.stringify(objById)}`);

    const res = Try.apply(() => this.repository().remove(id));
    if (res.isFailure()) return new ResultClass('Exception', `${this}.remove failed!! ${JSON.stringify(res)}`);
    return new ResultClass('Exception', 'remove failed');
  }
}
