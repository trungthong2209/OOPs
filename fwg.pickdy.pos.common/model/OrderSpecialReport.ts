import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import OrderReportCriterial from "./OrderReportCriterial";
import OrderSpecialReportItemCancel from "./OrderSpecialReportItemCancel";
import OrderSpecialReportCurrent from "./OrderSpecialReportCurrent";
export default class OrderSpecialReport extends BaseEntity<OrderSpecialReport> {
  searchCriterial : OrderReportCriterial = null; 
  totalNumber:number;
  totalPrice: number;
  itemCancels:Array<OrderSpecialReportItemCancel>;
  orders:Array<OrderSpecialReportCurrent>;
  constructor() {
    super();
    this.searchCriterial =  new OrderReportCriterial();
    this.itemCancels = new Array<OrderSpecialReportItemCancel>();
    this.orders = new Array<OrderSpecialReportCurrent>();
  }
  public assign(obj: any) {
    this._id = obj._id;
    this.totalNumber = obj.hasOwnProperty("totalNumber") ? obj.totalNumber : this.totalNumber;
    this.totalPrice = obj.hasOwnProperty("totalPrice") ? obj.totalPrice : this.totalPrice; 
    this.itemCancels = obj.hasOwnProperty("itemCancels") ? obj.itemCancels : this.itemCancels;
    this.orders = obj.hasOwnProperty("orders") ? obj.orders : this.orders;   
  }

  public static newInstance(): OrderSpecialReport {
    let result = new OrderSpecialReport();
    return result;
  }
}
