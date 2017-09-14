const BACK = 'BACK';
const FORWARD = 'FORWARD';
const WAIT = 'WAIT';
const CUSTOM = 'CUSTOM';

const operationCheck = type =>
  type === BACK ||
  type === FORWARD ||
  type === WAIT ||
  type === CUSTOM;

export { BACK, FORWARD, WAIT, CUSTOM, operationCheck };
