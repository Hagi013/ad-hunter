import BaseModel from './BaseModel';
import * as processType from './enum/HuntedProcessType';

export default class Type extends BaseModel {
  constructor(data) {
    super();
    if (super.emptyCheck(data)) return;

    this.id = super.notEmptyCheck(data.id) ? data.id : '';
    this.process = super.notEmptyCheck(data.process) && processType.processCheck(data.process) ? data.process : '';
  }
}
