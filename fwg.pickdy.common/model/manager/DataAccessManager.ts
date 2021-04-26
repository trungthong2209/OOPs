import Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import User from "../User";
import DataAccess from '../DataAccess';
export default class DataAccessManager extends BaseHelper<DataAccess> {
    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'dataAccess';
        this.classInfo.endPoint = "dataAccess"
        this.classInfo.type = DataAccess;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   

    }

    public createObject(data): Promise<DataAccess> {
        let promise = new Promise<DataAccess>((resolve, reject) => {
            let obj = new DataAccess();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: DataAccess, data: any) {
        obj._id = data._id;
        obj.name = data.name;
        obj.roleId = data.roleId;
        obj.dataAccessTypeId = data.dataAccessTypeId;
        obj.dataAccessPermissionIds = data.dataAccessPermissionIds;
    }
    public newInstance() {
        return new DataAccess();
    }

}

