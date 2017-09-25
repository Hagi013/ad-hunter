/* eslint-disable prefer-rest-params,no-underscore-dangle,no-throw-literal,no-useless-constructor,class-methods-use-this,max-len */

class Try {
  constructor(data) {
    this.value = data;
  }
  isSuccess() {}
  isFailure() {}
  get() {}
}

class Success extends Try {
  constructor(data) {
    super(data);
  }
  isSuccess() {
    return true;
  }
  isFailure() {
    return false;
  }
  get() {
    return this.value;
  }
  map(func) {
    return func(this.value);
  }
}


class Failure extends Try {
  constructor(data) {
    super(data);
  }
  isSuccess() {
    return false;
  }
  isFailure() {
    return true;
  }
  get() {
    throw 'Exeption!';
  }
}

export default class TryObject {
  static apply(obj) {
    try {
      return new Success(obj);
    } catch (e) {
      return new Failure(e);
    }
  }
}
