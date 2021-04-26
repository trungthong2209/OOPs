import BaseObj from '../BaseObj';
import BaseHelper from '../BaseHelper';
import IPersisnance from './IPersistance';
import ICache from './ICache';
import IDispatch from './IDispatch';
import ClassInfo from '../ClassInfo';


interface IAppAttachments {
    getPersistance<T extends BaseObj>(classInfo: ClassInfo, user:any): IPersisnance;
    getCache<T extends BaseObj>(classInfo: ClassInfo, user: any): ICache;
    getAppDispatcher<T extends BaseObj>(): IDispatch;
    SetAttachmentMethod<T extends BaseObj>(helper: BaseHelper<T>);
}

export default IAppAttachments;