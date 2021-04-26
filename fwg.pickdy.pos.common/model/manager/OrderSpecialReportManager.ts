let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import OrderSpecialReport from "../OrderSpecialReport";


export default class OrderSpecialReportManager extends BaseHelper<OrderSpecialReport> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "orders";
    this.classInfo.type = OrderSpecialReport;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "reports";
  }

  public createObject(data): Promise<OrderSpecialReport> {
    let promise = new Promise((resolve, reject) => {
      let obj = new OrderSpecialReport();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: OrderSpecialReport, data: any) {   
    obj.searchCriterial = data.searchCriterial;    
    obj.itemCancels = data.itemCancels;
    obj.orders = data.orders;    
    obj.totalNumber = data.totalNumber;
    obj.totalPrice = data.totalPrice;
  }
  public newInstance() {
    return new OrderSpecialReport();
  }
}
