import Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import User from "../User";
import Role from '../Role';
export default class RoleManager extends BaseHelper<Role> {
    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'roles';
        this.classInfo.endPoint = "roles"
        this.classInfo.type = Role;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   

    }

    public createObject(data): Promise<Role> {
        let promise = new Promise<Role>((resolve, reject) => {
            let obj = new Role();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: Role, data: any) {
        obj._id = data._id;
        obj.name = data.name;
        obj.applicationId = data.applicationId;
        obj.dataAccessIds = data.dataAccessIds;
        obj.description = data.description;
        obj.code = data.code;
    }
    public newInstance() {
        return new Role();
    }

}

