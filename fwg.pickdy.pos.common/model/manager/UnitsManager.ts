let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import Units from "../Units";

export default class UnitsManager extends BaseHelper<Units> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "units";
    this.classInfo.type = Units;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "units";
  }

  public createObject(data): Promise<Units> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Units();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Units, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.createByUserId = data.createByUserId ;
    obj.updateByUserId = data.updateByUserId;     
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;     
  }

  public newInstance() {
    return new Units();
  }
}
