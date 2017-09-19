/* eslint-disable */

const Tuple = function () {

  const typeInfo = Array.prototype.slice.call(arguments, 0);

  const _T = function () {

    const values = Array.prototype.slice.call(arguments, 0);

    if (values.some(val => val === null || val === undefined)) {
      throw new ReferenceError('Tuple may not have any null values');
    }

    if (values.length !== typeInfo.length) {
      throw new TypeError('Type arity does not match its prototype');
    }

    values.map((val, index) => {
      this[`_${index + 1}`] = classCheck(typeInfo[index])(val);
    }, this);

    Object.freeze(this);

  };

  _T.prototype.values = () => Object.keys(this).map(k => this[k], this);

  return _T;
};

const classCheck = Ctor => {
  return val => {
    if (!classIsEqual(Ctor, val)) {
      const type = val.__proto__.constructor;
      throw new TypeError(`Type mismatch. Expected [${Ctor}] but found [${type}]`);
    }
    return val;
  }
};

const classIsEqual = (Ctor, val) => {
  return val !== null && val.constructor === Ctor || val instanceof Ctor;
};


const typeIsEqual = typeDef => {
  return val => {

    // これをしないとオブジェクトリテラルで宣言された変数はconstructor比較ができない
    if (typeof val === 'object') val = new Object(val);

    // プリミティブ型のチェック
    if (typeof val !== 'object' && typeof val !== 'function' && typeof typeDef !== typeof val) {
      return false;

    } else  if (typeof val !== 'object' && Object.prototype.toString.call(typeDef) !== Object.prototype.toString.call(val)) { // オブジェクト以外の型チェック
      return false;

    } else if (typeof val === 'object' && typeDef.constructor !==  val.constructor) { // オブジェクトと独自クラスのチェック
      return false;
    }

    return true;
  }
};

export default Tuple;
