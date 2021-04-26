import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import OrderReportCriterial from "./OrderReportCriterial";
import ProductReportCategory from "./ProductReportCategory";
import ProductReportItems from "./ProductReportItems";
import ChartData from "./OrderChartData";
export default class OrderProductReport extends BaseEntity<OrderProductReport> {
  searchCriterial : OrderReportCriterial = null;
  categories:Array<ProductReportCategory>=null;
  productItems:Array<ProductReportItems>=null;
  chartData:Array<ChartData>=null;
  totalCount:number;
  totalPrice: number;
  constructor() {
    super();
    this.searchCriterial =  new OrderReportCriterial(); 
    this.categories =  new Array<ProductReportCategory>();    
    this.productItems =  new Array<ProductReportItems>();
    this.chartData =  new Array<ChartData>();   
  }
  public assign(obj: any) {
    this._id = obj._id;   
    this.searchCriterial = obj.hasOwnProperty("searchCriterial") ? obj.searchCriterial : this.searchCriterial;
    this.categories = obj.hasOwnProperty("categories") ? obj.categories : this.categories; 
    this.productItems = obj.hasOwnProperty("productItems") ? obj.productItems : this.productItems;
    this.chartData = obj.hasOwnProperty("chartData") ? obj.chartData : this.chartData; 
    this.totalCount = obj.hasOwnProperty("totalCount") ? obj.totalCount : this.totalCount; 
    this.totalPrice = obj.hasOwnProperty("totalPrice") ? obj.totalPrice : this.totalPrice;   
  }

  public static newInstance(): OrderProductReport {
    let result = new OrderProductReport();
    return result;
  }
}
