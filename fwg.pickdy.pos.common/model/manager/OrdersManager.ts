let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import HttpStatus from '../../../fwg.pickdy.common/base/HttpStatus';
import Orders from "../Orders";
export default class OrdersManager extends BaseHelper<Orders> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "orders";
    this.classInfo.type = Orders;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "orders";
  }

  public createObject(data): Promise<Orders> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Orders();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Orders, data: any) {
    obj._id = data._id;       
    obj.guestId =  data.guestId ? data.guestId : null;    
    obj.orderDateTime= data.orderDateTime;   
    obj.status= data.status;   
    obj.comment = data.comment;   
    obj.table =data.table;   
    obj.discountEventRules = data.discountEventRules;   
    obj.discountEventRuleValues = data.discountEventRuleValues;  
    obj.orderType = data.orderType;   
    obj.source=data.source;   
    obj.hasUnreadSMS = data.hasUnreadSMS;   
    obj.isPaidDeposit = data.isPaidDeposit;   
    obj.depositRules = data.depositRules;   
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;    
    obj.staffId = data.staffId ? data.staffId : null;    
    obj.priceOrder = data.priceOrder;   
    obj.priceDeposit = data.priceDeposit;   
    obj.createByUserId = data.createByUserId;   
    obj.updateByUserId = data.updateByUserId;   
    obj.createDateTime = data.createDateTime;   
    obj.updateDateTime = data.updateDateTime;
    obj.toId = data.toId;      
    obj.toDepositRules = data.toDepositRules;
    obj.toTable = data.toTable;
    obj.paymentMethod = data.paymentMethod;   
    obj.tax = data.tax;
    obj.serviceFee = data.serviceFee;
    obj.tip = data.tip; 
    obj.peopleCount = data.peopleCount;     
    obj.shops = data.shops; 
    obj.orderNumber = data.orderNumber;
    obj.tableValues = data.tableValues;
    obj.deviceOrder = data.deviceOrder;  
    obj.staffName = data.staffName;  
    obj.tableName = data.tableName;
    obj.shopName = data.shopName;     
    obj.moneyReturn = data.moneyReturn;         
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new Orders();
  }
}
