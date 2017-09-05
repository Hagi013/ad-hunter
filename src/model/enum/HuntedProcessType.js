const CLICK = 'CLICK';
const SCROLL = 'SCROLL';
const WAIT = 'WAIT';

const processCheck = (type) => {
  return type === CLICK || type === SCROLL || type === WAIT;
}


export { CLICK, SCROLL, WAIT , processCheck};
