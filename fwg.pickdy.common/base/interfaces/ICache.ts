let Promise = require('promise');
import BaseObj from '../BaseObj';
import BaseHelper from '../BaseHelper';
import HttpStatus from '../HttpStatus';

interface ICache {
    get < T extends BaseObj>(obj: BaseHelper<T>, key: string): Promise<HttpStatus<T>>;
    set < T extends BaseObj>(helper: BaseHelper<T>, key: string, obj:any):void;
    delete < T extends BaseObj>(helper: BaseHelper<T>, key: string): Promise<HttpStatus<T>>;
}

export default ICache;
