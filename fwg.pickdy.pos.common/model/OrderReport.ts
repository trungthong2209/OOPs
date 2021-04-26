import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import OrderReportCriterial from "./OrderReportCriterial";
import OrderChartData from "./OrderChartData";
import OrderReportSummary from "./OrderReportSummary";
import OrderReportPayment from "./OrderReportPayment";
import OrderReportStaff from "./OrderReportStaff";
import OrderReportTaxServiceFee from "./OrderReportTaxServiceFee";
import OrderReportStaffDetail from "./OrderReportStaffDetail";
import OrderReportDetail from "./OrderReportDetail";
export default class OrderReport extends BaseEntity<OrderReport> {
  searchCriterial : OrderReportCriterial = null;
  chartData:Array<OrderChartData>;
  totalNumber:number;
  totalPrice: number;
  summaries:Array<OrderReportSummary>;
  payments:Array<OrderReportPayment>;
  staffs:Array<OrderReportStaff>;
  taxServiceFees:Array<OrderReportTaxServiceFee>;  
  staffDetails:Array<OrderReportStaffDetail>; 
  orderReportDetails:Array<OrderReportDetail>;  
  
  constructor() {
    super();
    this.searchCriterial =  new OrderReportCriterial();
    this.chartData = new Array<OrderChartData>();
    this.summaries = new Array<OrderReportSummary>();
    this.payments = new Array<OrderReportPayment>();
    this.staffs = new Array<OrderReportStaff>();
    this.taxServiceFees = new Array<OrderReportTaxServiceFee>();
    this.staffDetails = new Array<OrderReportStaffDetail>();
    this.orderReportDetails = new Array<OrderReportDetail>();
  }
  public assign(obj: any) {
    this._id = obj._id;
    this.searchCriterial = obj.hasOwnProperty("searchCriterial") ? obj.searchCriterial : this.searchCriterial;
    this.chartData = obj.hasOwnProperty("chartData") ? obj.chartData : this.chartData;
    this.summaries= obj.hasOwnProperty("summaries") ? obj.summaries : this.summaries;
    this.payments = obj.hasOwnProperty("payments") ? obj.payments : this.payments;
    this.staffs = obj.hasOwnProperty("staffs") ? obj.staffs : this.staffs;
    this.taxServiceFees = obj.hasOwnProperty("taxServiceFees") ? obj.invoiceReportTaxServiceFees : this.taxServiceFees;
    this.staffDetails = obj.hasOwnProperty("staffDetails") ? obj.staffDetails : this.staffDetails;
    this.orderReportDetails = obj.hasOwnProperty("orderReportDetails") ? obj.orderReportDetails : this.orderReportDetails;
    this.totalNumber = obj.hasOwnProperty("totalNumber") ? obj.totalNumber : this.totalNumber;
    this.totalPrice = obj.hasOwnProperty("totalPrice") ? obj.totalPrice : this.totalPrice;    
  }

  public static newInstance(): OrderReport {
    let result = new OrderReport();
    return result;
  }
}
