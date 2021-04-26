import Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import User from "../User";
import LocationType from '../LocationType';
export default class LocationTypeManager extends BaseHelper<LocationType> {
    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'locationTypes';
        this.classInfo.endPoint = "locationTypes"
        this.classInfo.type = LocationType;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   

    }

    public createObject(data): Promise<LocationType> {
        let promise = new Promise<LocationType>((resolve, reject) => {
            let obj = new LocationType();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: LocationType, data: any) {
        obj._id = data._id;
        obj.name = data.name;        
    }
    public newInstance() {
        return new LocationType();
    }

}

