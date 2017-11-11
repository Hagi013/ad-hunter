// import { getItemFromStorage, upsertItemToStorage } from '../localstorage/localstorage';
// import { notArrayCheck } from '../utils/CheckUtils';
import BaseRepository from './BaseRepository';

export default class UserAgentRepository extends BaseRepository {

  static repoName() {
    return 'userAgent';
  }
}
