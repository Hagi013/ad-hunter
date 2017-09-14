const not = res => !res;

export const emptyCheck = data => data === '' || data === undefined || data === null;

export const notEmptyCheck = data => not(emptyCheck(data));

export const arrayCheck = data => notEmptyCheck(data) && Array.isArray(data);

export const notArrayCheck = data => not(arrayCheck(data));

export const emptyObjCheck = obj => emptyCheck(obj) || Object.keys(obj).length === 0 || obj === {};

export const notEmptyObjCheck = obj => not(emptyObjCheck(obj));
