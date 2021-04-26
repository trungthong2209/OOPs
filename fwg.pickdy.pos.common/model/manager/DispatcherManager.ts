let Promise = require('promise');
import BaseHelper from '../../../fwg.pickdy.common/base/BaseHelper';
import Dispatcher from '../Dispatcher';
import ClassInfo from '../../../fwg.pickdy.common/base/ClassInfo';
import HttpStatus from "../../../fwg.pickdy.common/base/HttpStatus";
import Constants from '../../../fwg.pickdy.common/base/Constants';
import Staffs from "../Staffs";
import {EventType} from '../Dispatcher';
import BaseObj from '../../../fwg.pickdy.common/base/BaseObj';
import AppConfig from "../../utilities/AppConfig";


export default class DispatcherManager extends BaseHelper<Dispatcher> {

    constructor(user: Staffs) {
        super(user);
        this.classInfo.mongoCollectionName = 'dispatchers';
        this.classInfo.type = Dispatcher;
        this.classInfo.nameSpace = "tgn.kitchenmonitor";
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.endPoint = 'dispatchers';
    }

    public createObject(data): Promise<Dispatcher> {
        let promise = new Promise((resolve, reject) => {
            let obj = new Dispatcher();
            obj.assign(data);
            resolve(obj);
        });
        return promise;

    }

    public dispatchMany<T extends BaseObj>(eventType: EventType, baseObjs:Array<any>, helper: any){
        if (this.isApi()){
            for (var i = 0; i < baseObjs.length; i++) {
                this.dispatch<T>(eventType, baseObjs[i], helper)
            }
        }
    }


    public dispatch<T extends BaseObj>(eventType: EventType, baseObj:any, helper: any, dispatchCriteria: any = null){
        if (this.isApi()){
            let dispatcher = new Dispatcher();
            dispatcher.eventType = eventType;
            dispatcher.id = baseObj._id;
            dispatcher.nameSpace = helper.classInfo.nameSpace;
            dispatcher.mongoCollectionName = helper.classInfo.mongoCollectionName;
            dispatcher.criteia = dispatchCriteria;
            return this.create(dispatcher);
        }
    }

    public static appDispatch(data){
        let appAttchements = AppConfig.GetAppAttachments();
        let appDispatcher = appAttchements.getAppDispatcher();

        if(appDispatcher){
            appDispatcher.queueDispatch(data);
        }
    }

    public get(search: any): Promise<HttpStatus<Dispatcher>> {
        throw new Error("NOT IMPLMENTED");
    }

    public search(search: any): Promise<HttpStatus<Array<Dispatcher>>> {
        throw new Error("NOT IMPLMENTED");
    }

     public create(dispatcher: Dispatcher): Promise<HttpStatus<Dispatcher>> {
        return  super.insert(dispatcher);
    }

	public update(search: any, data: Dispatcher): Promise<HttpStatus<Dispatcher>> {
        throw new Error("NOT IMPLMENTED");
    }

    public newInstance() {
        return new Dispatcher();
    }
}
