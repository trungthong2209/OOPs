import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import DepositRules from "./DepositRules";
export default class OrdersTakeAway extends BaseEntity<OrdersTakeAway> {
  orderNumber: string = "0";  
  orderDateTime : Date;
  status : string;
  comment : string=null;  
  orderType : string=null;
  depositRules : Array<DepositRules> ;
  priceOrder :  number=0;
  priceDeposit :  number=0;
  createByUserId : string=null;
  updateByUserId : string=null;
  createDateTime : Date=null;
  updateDateTime : Date=null;     
  @ValidationDecorator.required(Constants.TEL_BOOKING_REQUIRE) 
  telBooking : number;
  shippingAdress: string;
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE) 
  shopId : number;
  constructor() {
    super();
    this.depositRules =  new Array<DepositRules>();   
  }

  public assign(obj: any) {
    this._id = obj._id;   
    this.orderDateTime= obj.hasOwnProperty("orderDateTime") ? obj.orderDateTime : this.orderDateTime;
    this.status= obj.hasOwnProperty("status") ? obj.status : this.status;
    this.comment = obj.hasOwnProperty("comment") ? obj.comment : this.comment;        
    this.orderType = obj.hasOwnProperty("orderType") ? obj.orderType : this.orderType;  
    this.depositRules = obj.hasOwnProperty("depositRules") ? obj.depositRules : this.depositRules;    
    this.priceOrder = obj.hasOwnProperty("priceOrder") ? obj.priceOrder : this.priceOrder;
    this.priceDeposit = obj.hasOwnProperty("priceDeposit") ? obj.priceDeposit : this.priceDeposit;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime: this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;  
    this.orderNumber = obj.hasOwnProperty("orderNumber") ? obj.orderNumber : this.orderNumber;        
    this.telBooking = obj.hasOwnProperty("telBooking") ? obj.telBooking : this.telBooking; 
    this.shippingAdress = obj.hasOwnProperty("shippingAdress") ? obj.shippingAdress : this.shippingAdress;  
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;       
  }

  public static newInstance(): OrdersTakeAway {
    let result = new OrdersTakeAway();
    return result;
  }
}
