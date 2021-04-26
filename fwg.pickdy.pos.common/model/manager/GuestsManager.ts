let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Guests from "../Guests";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";

export default class GuestsManager extends BaseHelper<Guests>{
    constructor(user: Staffs) {
        super(user);
        this.classInfo.mongoCollectionName = "guests";
        this.classInfo.type = Guests;
        this.classInfo.nameSpace = "fwg.pickdy.pos.common";
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.endPoint = "guests";
    }

    public createObject(data): Promise<Guests> {
        let promise = new Promise((resolve, reject) => {
          let obj = new Guests();
          this.assignObject(obj, data);
          resolve(obj);
        });
        return promise;
      }
    
      public assignObject(obj: Guests, data: any) {
        obj._id = data._id;
        obj.firstName = data.firstName;
        obj.lastName = data.lastName;
        obj.email = data.email;
        obj.phone = data.phone;
        obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
      }
      public newInstance() {
        return new Guests();
      }

}