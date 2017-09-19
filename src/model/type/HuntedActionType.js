const CLICK = 'CLICK';
const SCROLL = 'SCROLL';
const WAIT = 'WAIT';
const OPERATION = 'OPERATION';

const actionTypeCheck = type =>
  type === CLICK ||
  type === SCROLL ||
  type === WAIT ||
  type === OPERATION;

export { CLICK, SCROLL, WAIT, OPERATION, actionTypeCheck };
