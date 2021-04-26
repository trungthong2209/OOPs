import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import DepositRules from "./DepositRules";
import Shops from "./Shops";
import DiscountEventRules from "./DiscountEventRules";
import Tables from "./Tables";
export default class Orders extends BaseEntity<Orders> {
  orderNumber: string = "0";
  guestId : string=null;
  orderDateTime : Date;
  status : string;
  comment : string=null;
  @ValidationDecorator.required(Constants.ORDER.TABLE_REQUIRE)
  table : string;
  discountEventRules : Array<string>=null;
  orderType : string=null;
  source : string=null;
  quotedInterval : number;
  hasUnreadSMS : boolean = false;
  isPaidDeposit : boolean = false;
  depositRules : Array<DepositRules> ;
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
  shopId : string=null;
  staffId : string=null;
  priceOrder :  number=0;
  priceDeposit :  number=0;
  createByUserId : string=null;
  updateByUserId : string=null;
  createDateTime : Date=null;
  updateDateTime : Date=null;
  @IgnoreDecorator.ignoreInDb()
  toId: string;
  @IgnoreDecorator.ignoreInDb()
  toDepositRules : Array<DepositRules> ;
  @IgnoreDecorator.ignoreInDb()
  toTable : string ;
  paymentMethod:string;
  tax:number;
  serviceFee:number=0;
  tip :number =0 ;
  peopleCount :number = 1;
  @IgnoreDecorator.ignoreInDb()
  shops: Array<Shops>;
  @IgnoreDecorator.ignoreInDb()
  discountEventRuleValues : Array<DiscountEventRules>=null;
  @IgnoreDecorator.ignoreInDb()
  tableValues: Tables;
  deviceOrder:string=null;  
  @IgnoreDecorator.ignoreInDb()
  staffName : string=null;
  @IgnoreDecorator.ignoreInDb()
  tableName : string=null;
  @IgnoreDecorator.ignoreInDb()
  shopName : string=null;
  moneyReturn : number=0; 
  constructor() {
    super();
    this.depositRules =  new Array<DepositRules>();
    this.shops =  new Array<Shops>();
    this.discountEventRules = new Array<string>();
    this.discountEventRuleValues = new Array<DiscountEventRules>();
    this.tableValues = new Tables();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.guestId = obj.hasOwnProperty("guestId") ? obj.guestId : this.guestId;
    this.orderDateTime= obj.hasOwnProperty("orderDateTime") ? obj.orderDateTime : this.orderDateTime;
    this.status= obj.hasOwnProperty("status") ? obj.status : this.status;
    this.comment = obj.hasOwnProperty("comment") ? obj.comment : this.comment;
    this.table = obj.hasOwnProperty("table") ? obj.table : this.table;
    this.discountEventRules = obj.hasOwnProperty("discountEventRules") ? obj.discountEventRules : this.discountEventRules;
    this.discountEventRuleValues = obj.hasOwnProperty("discountEventRules") ? obj.discountEventRuleValues : this.discountEventRuleValues;
    this.orderType = obj.hasOwnProperty("orderType") ? obj.orderType : this.orderType;
    this.source= obj.hasOwnProperty("source") ? obj.source : this.source;
    this.hasUnreadSMS = obj.hasOwnProperty("hasUnreadSMS") ? obj.hasUnreadSMS : this.hasUnreadSMS;
    this.isPaidDeposit = obj.hasOwnProperty("isPaidDeposit") ? obj.isPaidDeposit : this.isPaidDeposit;
    this.depositRules = obj.hasOwnProperty("depositRules") ? obj.depositRules : this.depositRules;
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
    this.staffId = obj.hasOwnProperty("staffId") ? obj.staffId : this.staffId;
    this.priceOrder = obj.hasOwnProperty("priceOrder") ? obj.priceOrder : this.priceOrder;
    this.priceDeposit = obj.hasOwnProperty("priceDeposit") ? obj.priceDeposit : this.priceDeposit;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime: this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;    
    this.toId = obj.hasOwnProperty("toId") ? obj.toId : this.toId;    
    this.toDepositRules = obj.hasOwnProperty("toDepositRules") ? obj.toDepositRules : this.toDepositRules;  
    this.toTable = obj.hasOwnProperty("toTable") ? obj.toTable : this.toTable;  
    this.paymentMethod = obj.hasOwnProperty("paymentMethod") ? obj.paymentMethod : this.paymentMethod;
    this.tax = obj.hasOwnProperty("tax") ? obj.tax : this.tax;
    this.serviceFee = obj.hasOwnProperty("serviceFee") ? obj.serviceFee : this.serviceFee;  
    this.tip = obj.hasOwnProperty("tip") ? obj.tip : this.tip;
    this.peopleCount = obj.hasOwnProperty("peopleCount") ? obj.peopleCount : this.peopleCount; 
    this.shops = obj.hasOwnProperty("shops") ? obj.shops : this.shops;
    this.orderNumber = obj.hasOwnProperty("orderNumber") ? obj.orderNumber : this.orderNumber;    
    this.tableValues = obj.hasOwnProperty("tableValues") ? obj.tableValues : this.tableValues;  
    this.deviceOrder = obj.hasOwnProperty("deviceOrder") ? obj.deviceOrder : this.deviceOrder;  
    this.staffName = obj.hasOwnProperty("staffName") ? obj.staffName : this.staffName;  
    this.tableName = obj.hasOwnProperty("tableName") ? obj.tableName : this.tableName; 
    this.shopName = obj.hasOwnProperty("shopName") ? obj.shopName : this.shopName;
    this.moneyReturn = obj.hasOwnProperty("moneyReturn") ? obj.moneyReturn : this.moneyReturn;   
  }

  public static newInstance(): Orders {
    let result = new Orders();
    return result;
  }
}
