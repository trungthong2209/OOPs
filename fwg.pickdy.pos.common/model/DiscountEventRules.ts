import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
export default class DiscountEventRules extends BaseEntity<DiscountEventRules> { 
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  eventName : string = null;
  effectDateTime : Date= null;
  endDateTime :  Date= null;
  @ValidationDecorator.required(Constants.DISCOUNTEVENTRULES.DISCOUNTTYPE_REQUIRE)
  discountType : string = null;
  eventValue : string = null;
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
  shopId : string = null;
  isActivated : boolean;
  discountCode : number = null;
  limitNumber : number=0;
  qrcode : number = null;
  createByUserId : string = null;
  updateByUserId : string = null;
  createDateTime : Date = null;
  updateDateTime : Date = null;
  categories:Array<string>;
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;   
    this.eventName = obj.hasOwnProperty("eventName") ? obj.eventName: this.eventName;    
    this.effectDateTime = obj.hasOwnProperty("effectDateTime") ? obj.effectDateTime: this.effectDateTime; 
    this.endDateTime = obj.hasOwnProperty("endDateTime") ? obj.endDateTime: this.endDateTime; 
    this.discountType = obj.hasOwnProperty("discountType") ? obj.discountType: this.discountType; 
    this.eventValue = obj.hasOwnProperty("eventValue") ? obj.eventValue: this.eventValue; 
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId: this.shopId; 
    this.isActivated = obj.hasOwnProperty("isActivated") ? obj.isActivated: this.isActivated; 
    this.discountCode = obj.hasOwnProperty("discountCode") ? obj.discountCode: this.discountCode; 
    this.qrcode = obj.hasOwnProperty("qrcode") ? obj.qrcode: this.qrcode; 
    this.limitNumber = obj.hasOwnProperty("limitNumber") ? obj.limitNumber: this.limitNumber; 
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId: this.createByUserId; 
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId: this.updateByUserId; 
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime: this.createDateTime; 
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime: this.updateDateTime; 
    this.categories = obj.hasOwnProperty("categories") ? obj.categories: this.categories;     
  }

  public static newInstance(): DiscountEventRules {
    let result = new DiscountEventRules();
    return result;
  }
}
