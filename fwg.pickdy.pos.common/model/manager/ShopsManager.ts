let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import Shops from "../Shops";
import HttpStatus from "../../../fwg.pickdy.common/base/HttpStatus";
export default class ShopsManager extends BaseHelper<Shops> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "shops";
    this.classInfo.type = Shops;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "shops";
  }

  public createObject(data): Promise<Shops> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Shops();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Shops, data: any) {
    obj._id = data._id;       
    obj.name =  data.name;
    obj.subscriptionId =  data.subscriptionId;
    obj.orginizationId =  data.orginizationId;
    obj.parentLocationId =  data.parentLocationId;
    obj.locationId =  data.locationId;
    obj.address =  data.address;
    obj.ownerId =  data.ownerId;
    obj.shopType =  data.shopType;
    obj.businessModel =  data.businessModel;
    obj.tel =  data.tel;
    obj.owner =  data.owner;   
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
    obj.qrcode = data.qrcode;
    obj.taxCode = data.taxCode;
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new Shops();
  }
}
