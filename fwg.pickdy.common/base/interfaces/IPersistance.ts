import BaseObj from '../BaseObj';
import BaseHelper from '../BaseHelper';
import HttpStatus from '../HttpStatus';
interface IPersistance {
    get < T extends BaseObj>(obj: BaseHelper<T>, search: any): Promise<HttpStatus<T>>;
    search < T extends BaseObj>(obj: BaseHelper<T>, search: any): Promise<HttpStatus<Array<T>>>;
	insert<T extends BaseObj>(obj: BaseHelper <T>, data: T): Promise<HttpStatus<T>>;
	delete <T extends BaseObj> (helper: BaseHelper <T>, search: any): Promise<HttpStatus<boolean>>;
    update<T extends BaseObj>(helper: BaseHelper <T>, search: any, data: T): Promise<HttpStatus<T>>;
    updateMany<T extends BaseObj>(helper: BaseHelper <T>, search: any, data: Array<T>): Promise<HttpStatus<boolean>>;
    insertMany<T extends BaseObj> (obj: BaseHelper<T>, data: Array<T>): Promise<HttpStatus<Array<T>>>;
    deleteMany<T extends BaseObj>(obj: BaseHelper<T>, data: Array<T>): Promise<HttpStatus<number>>;
    objectID(obj: any): any;
}
export default IPersistance;