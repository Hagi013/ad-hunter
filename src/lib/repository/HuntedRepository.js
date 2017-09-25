import { getItemFromStorage, upsertItemToStorage } from '../localstorage/localstorage';
import { notArrayCheck } from '../utils/CheckUtils';

export default class HuntedRepository {

  static findAll() {
    return getItemFromStorage('hunted');
  }

  static findById(id) {
    return this.findAll().filter(h => id === h.id)[0];
  }

  static upsert(hunted) {
    const all = this.findAll();
    console.log(all);

    // 初回新規登録
    if (notArrayCheck(all)) {
      this.upsertToStorage([hunted]);
      return this.findById(hunted.id);
    }

    const existing = all.filter(h => h.id === hunted.id).length > 0;

    // 更新
    if (existing) {
      this.upsertToStorage(all.map((h) => {
        if (h.id === hunted.id) return hunted;
        return h;
      }));
      return this.findById(hunted.id);
    }

    // 新規登録
    all.push(hunted);
    this.upsertToStorage(all);
    return this.findById(hunted.id);
  }

  static upsertToStorage(huntedList) {
    upsertItemToStorage('hunted', huntedList);
  }
}
