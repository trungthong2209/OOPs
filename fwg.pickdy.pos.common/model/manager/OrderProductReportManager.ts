let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import OrderProductReport from "../OrderProductReport";

export default class OrderProductReportManager extends BaseHelper<OrderProductReport> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "orders";
    this.classInfo.type = OrderProductReport;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "reports";
  }

  public createObject(data): Promise<OrderProductReport> {
    let promise = new Promise((resolve, reject) => {
      let obj = new OrderProductReport();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: OrderProductReport, data: any) {   
    obj.searchCriterial = data.searchCriterial;    
    obj.categories = data.categories; 
    obj.productItems = data.productItems; 
    obj.chartData = data.chartData;    
    obj.totalCount = data.totalCount;
    obj.totalPrice = data.totalPrice;
  }
  public newInstance() {
    return new OrderProductReport();
  }
}
