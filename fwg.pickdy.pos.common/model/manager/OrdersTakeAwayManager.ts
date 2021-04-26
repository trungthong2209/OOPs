let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import HttpStatus from '../../../fwg.pickdy.common/base/HttpStatus';
import OrdersTakeAway from "../OrdersTakeAway";
export default class OrdersTakeAwayManager extends BaseHelper<OrdersTakeAway> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "ordersTakeaway";
    this.classInfo.type = OrdersTakeAway;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "ordersTakeaway";
  }

  public createObject(data): Promise<OrdersTakeAway> {
    let promise = new Promise((resolve, reject) => {
      let obj = new OrdersTakeAway();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: OrdersTakeAway, data: any) {
    obj._id = data._id;       
    obj.orderDateTime= data.orderDateTime;   
    obj.status= data.status;   
    obj.comment = data.comment;   
     obj.orderType = data.orderType;   
    obj.depositRules = data.depositRules;   
    obj.priceOrder = data.priceOrder;   
    obj.priceDeposit = data.priceDeposit;   
    obj.createByUserId = data.createByUserId;   
    obj.updateByUserId = data.updateByUserId;   
    obj.createDateTime = data.createDateTime;   
    obj.updateDateTime = data.updateDateTime;   
    obj.orderNumber = data.orderNumber;
    obj.telBooking = data.telBooking;
    obj.shippingAdress = data.shippingAdress;
    obj.shopId = data.shopId;
          
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new OrdersTakeAway();
  }
}
