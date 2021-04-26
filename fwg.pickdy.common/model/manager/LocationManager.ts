import BaseHelper from '../../base/BaseHelper';
import Location from '../Location';
import User from '../User';
import Constants from '../../base/Constants';
let Promise = require("promise");

export default class LocationManager extends BaseHelper<Location> {

    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'locations';
        this.classInfo.endPoint = "locations"
        this.classInfo.type = Location;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   
    }

    public createObject(data): Promise<Location> {
        let promise = new Promise((resolve, reject) => {
            let obj = new Location();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }

    public setUser(user: User) {
        super.setUser(user);
    }

    public assignObject(obj: Location, data: any): Location
    {
        obj._id = data._id;
        obj.name = data.name;
        obj.locationTypeId = data.locationTypeId;
        obj.orginizationId = data.orginizationId;
        obj.ownerUserId = data.ownerUserId;
        obj.parentLocationId = data.parentLocationId; 
        return obj;   
    }

   
    public newInstance() {
        return new Location();
    }

}


