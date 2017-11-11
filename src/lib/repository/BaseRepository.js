import { getItemFromStorage, upsertItemToStorage } from '../localstorage/localstorage';
import { notArrayCheck } from '../utils/CheckUtils';
import Exception from '../Exception';


export default class BaseRepository {

  static repoName() {
    throw new Exception('Not Implemented Error');
  }

  static findAll() {
    return getItemFromStorage(this.repoName());
  }

  static findById(id) {
    return this.findAll().filter(e => e.id === id)[0];
  }

  static upsert(obj) {
    const all = this.findAll();
    console.log(obj);

    // 初回新規登録
    if (notArrayCheck(all)) {
      this.upsertToStorage([obj]);
      return this.findById(obj.id);
    }

    const existing = all.filter(e => e.id === obj.id).length > 0;

    // 更新
    if (existing) {
      this.upsertToStorage(all.map((e) => {
        if (e.id === obj.id) return obj;
        return e;
      }));
      return this.findById(obj.id);
    }

    // 新規登録
    all.push(obj);
    this.upsertToStorage(all);
    return this.findById(obj.id);
  }

  static upsertToStorage(objList) {
    upsertItemToStorage(this.repoName(), objList);
  }

  static remove(id) {
    this.findAll().forEach((e) => {
      console.log(id, e.id, id === e.id);
    });
    this.upsertToStorage(this.findAll().filter(e => e.id !== id));
  }
}
