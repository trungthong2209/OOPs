let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import HttpStatus from '../../../fwg.pickdy.common/base/HttpStatus';
import DiscountEventRules from "../DiscountEventRules";

export default class DiscountEventRulesManager extends BaseHelper<DiscountEventRules> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "discountEventRules";
    this.classInfo.type = DiscountEventRules;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "discountEventRules";
  }

  public createObject(data): Promise<DiscountEventRules> {
    let promise = new Promise((resolve, reject) => {
      let obj = new DiscountEventRules();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: DiscountEventRules, data: any) {
    obj._id = data._id;
    obj.eventName = data.eventName;
    obj.effectDateTime = data.effectDateTime;
    obj.endDateTime = data.endDateTime;
    obj.discountType = data.discountType;    
    obj.eventValue = data.eventValue;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
    obj.isActivated = data.isActivated;
    obj.discountCode = data.discountCode;
    obj.qrcode = data.qrcode;
    obj.categories = data.categories;
    obj.limitNumber = data.limitNumber;
    obj.createByUserId = data.createByUserId;
    obj.updateByUserId =data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new DiscountEventRules();
  }
}
