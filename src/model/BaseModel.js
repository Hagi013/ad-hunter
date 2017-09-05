export default class BaseModel {

  emptyCheck(data) {
    return data === '' || data === undefined || data === null;
  }

  notEmptyCheck(data) {
    return !this.emptyCheck(data);
  }

  arrayCheck(data) {
    return this.notEmptyCheck(data) && Array.isArray(data);
  }

}
