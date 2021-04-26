import Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import User from "../User";
import DataAccessType from '../DataAccessType';
export default class DataAccessManager extends BaseHelper<DataAccessType> {
    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'dataAccessTypes';
        this.classInfo.endPoint = "dataAccessTypes"
        this.classInfo.type = DataAccessType;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   

    }

    public createObject(data): Promise<DataAccessType> {
        let promise = new Promise<DataAccessType>((resolve, reject) => {
            let obj = new DataAccessType();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: DataAccessType, data: any) {
        obj._id = data._id;
        obj.name = data.name;
        obj.applicationId = data.applicationId;
    }
    public newInstance() {
        return new DataAccessType();
    }

}

