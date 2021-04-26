let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import OrderReport from "../OrderReport";

export default class OrderReportManager extends BaseHelper<OrderReport> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "orders";
    this.classInfo.type = OrderReport;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "reports";
  }

  public createObject(data): Promise<OrderReport> {
    let promise = new Promise((resolve, reject) => {
      let obj = new OrderReport();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: OrderReport, data: any) {   
    obj.searchCriterial = data.searchCriterial;    
    obj.chartData = data.chartData; 
    obj.summaries = data.summaries; 
    obj.staffs = data.staffs; 
    obj.staffDetails = data.staffDetails; 
    obj.payments = data.payments; 
    obj.taxServiceFees = data.taxServiceFees; 
    obj.orderReportDetails = data.orderReportDetails; 
    obj.totalNumber = data.totalNumber;
    obj.totalPrice = data.totalPrice;
  }
  public newInstance() {
    return new OrderReport();
  }
}
