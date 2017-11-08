import { getItemFromStorage, upsertItemToStorage } from '../localstorage/localstorage';
import { notArrayCheck } from '../utils/CheckUtils';

export default class UserAgentRepository {

  static findAll() {
    return getItemFromStorage('userAgent');
  }

  static findById(id) {
    return this.findAll().filter(u => u.id === id)[0];
  }

  static upsert(ua) {
    const all = this.findAll();
    console.log(all);

    // 初回新規登録
    if (notArrayCheck(all)) {
      this.upsertToStorage([ua]);
      return this.findById(ua.id);
    }

    const existing = all.filter(u => u.id === ua.id).length > 0;

    // 更新
    if (existing) {
      this.upsertToStorage(this.updateList(all, ua));
      return this.findById(ua.id);
    }

    // 新規登録
    all.push(ua);
    this.upsertToStorage(all);
    return this.findById(ua.id);
  }

  static updateList(list, target) {
    return list.map((u) => {
      if (u.id === target.id) return target;
      return u;
    });
  }

  static upsertToStorage(uaList) {
    upsertItemToStorage('userAgent', uaList);
  }

  static remove(id) {
    this.findAll().forEach((u) => {
      console.log(id, u.id, id === u.id);
    });
    this.upsertToStorage(this.findAll().filter(u => u.id !== id));
  }
}
