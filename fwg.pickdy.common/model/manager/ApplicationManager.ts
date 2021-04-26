import Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import User from "../../../fwg.pickdy.common/model/User";
import Application from '../Application';
export default class ApplicationManager extends BaseHelper<Application> {
    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'applications';
        this.classInfo.endPoint = "applications"
        this.classInfo.type = Application;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   

    }

    public createObject(data): Promise<Application> {
        let promise = new Promise<Application>((resolve, reject) => {
            let obj = new Application();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: Application, data: any) {
        obj._id = data._id;
        obj.name = data.name;
        obj.url = data.url;
    }
    public newInstance() {
        return new Application();
    }

}

