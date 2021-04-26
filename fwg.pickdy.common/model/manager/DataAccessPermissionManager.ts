import Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import User from "../User";
import DataAccessPermission from '../DataAccessPermission';
export default class DataAccessPermissionManager extends BaseHelper<DataAccessPermission> {
    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'dataAccessPermissions';
        this.classInfo.endPoint = "dataAccessPermissions"
        this.classInfo.type = DataAccessPermission;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   

    }

    public createObject(data): Promise<DataAccessPermission> {
        let promise = new Promise<DataAccessPermission>((resolve, reject) => {
            let obj = new DataAccessPermission();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: DataAccessPermission, data: any) {
        obj._id = data._id;
        obj.name = data.name;
    }
    public newInstance() {
        return new DataAccessPermission();
    }

}

