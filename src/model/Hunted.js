import BaseModel from './BaseModel';
import Flow from './Flow';

export default class Hunted extends BaseModel{
  constructor(data) {
    super();
    if (super.emptyCheck(data)) return;

    this.id = super.notEmptyCheck(data.id) ? data.id : '';
    this.url = super.notEmptyCheck(data.url) ? data.url : '';
    this.flow = super.arrayCheck(data.flow) ? data.flow.map(f => new Flow(f)) : '';
    this.updatedAt = super.notEmptyCheck(data.updatedAt) ? data.updatedAt : '';
    this.settings = super.notEmptyCheck(data.settings) ? new Settings(data.settings) : '';
    this.description = super.notEmptyCheck(data.description) ? data.description : '';
  }
}
