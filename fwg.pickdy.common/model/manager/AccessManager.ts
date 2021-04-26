let Promise = require("promise");
import BaseHelper from '../../base/BaseHelper';
import Access from '../Access';
import User from '../User';
import RoleManager from './RoleManager';
import Constants from '../../base/Constants';
import LocationManager from './LocationManager';

export default class AccessManager extends BaseHelper<Access> {
 
    protected locationManager: LocationManager;
    protected roleManager: RoleManager;

    constructor(user: User) {
        super(user);
        this.classInfo.type = Access;
        this.classInfo.nameSpace = "fwg.pickdy.common";
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.locationManager = new LocationManager(user);
        this.roleManager =  new RoleManager(user);     
    }

    public createObject(data): Promise<Access>  {
        let promise = new Promise((resolve, reject) => {
            let obj = new Access();
            return this.assignObject(obj, data)
                  .catch((e) => resolve(e))
                  .then(() => {
                    resolve(obj);
                });
        });
        return promise;
    }    

    public assignObject(obj: Access, data: any): Promise<Access> {
        let promise = new Promise((resolve, reject) => {
            this.locationManager.get({ "_id": this.objectID(data.locationId) })
            .catch((e) => resolve(e))
            .then((collectionData) => {
                obj.location = collectionData.entity;
                //get the role
                this.roleManager.get({ "_id": this.objectID(data.roleId) })
                .catch((e) => resolve(e))
                .then((roleData) => {
                    obj.role = roleData.entity;     
                    let requiredSubCheckData : any = {};
                    requiredSubCheckData.locationId = data.locationId;
                    requiredSubCheckData.accessId = roleData.entity.applicationId;  
                    this.onBeforeAssign(requiredSubCheckData, this.user)
                    .catch((e) => resolve(e))
                    .then((result) => {
                        resolve();  //return when have everything.
                    });
                });
            });
        });
        return (promise);
    }
   

}
