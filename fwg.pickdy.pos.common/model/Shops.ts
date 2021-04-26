import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import Staffs from "./Staffs";
export default class Shops extends BaseEntity<Shops> {
  public subscriptionId: string=null;
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  public name: string=null;
  public orginizationId: string=null;
  public parentLocationId: string=null;
  public locationId: string=null; 
  public address: string=null; 
  public ownerId: string=null; 
  public shopType: string=null;
  public businessModel: string=null;
  public tel: number;
  @IgnoreDecorator.ignoreInDb()
  public owner:Staffs;
  createByUserId: string=null;    
  updateByUserId: string=null;    
  createDateTime: Date=null;    
  updateDateTime: Date=null;  
  qrcode:string=null; 
  taxCode:string=null; 
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name")  ? obj.name  : this.name;
    this.subscriptionId = obj.hasOwnProperty("subscriptionId")  ? obj.subscriptionId  : this.subscriptionId;
    this.orginizationId = obj.hasOwnProperty("orginizationId")  ? obj.orginizationId  : this.orginizationId;
    this.parentLocationId = obj.hasOwnProperty("parentLocationId")  ? obj.parentLocationId  : this.parentLocationId;
    this.locationId = obj.hasOwnProperty("locationId")  ? obj.locationId  : this.locationId;
    this.address = obj.hasOwnProperty("address")  ? obj.address  : this.address;
    this.ownerId = obj.hasOwnProperty("ownerId")  ? obj.ownerId  : this.ownerId;
    this.shopType = obj.hasOwnProperty("shopType")  ? obj.shopType  : this.shopType;  
    this.businessModel = obj.hasOwnProperty("businessModel")  ? obj.businessModel  : this.businessModel; 
    this.tel = obj.hasOwnProperty("tel")  ? obj.tel  : this.tel;  
    this.owner = obj.hasOwnProperty("owner")  ? obj.owner  : this.owner;  
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;  
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;  
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;  
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    this.qrcode = obj.hasOwnProperty("qrcode") ? obj.qrcode : this.qrcode;  
    this.taxCode = obj.hasOwnProperty("taxCode") ? obj.taxCode : this.taxCode;  
  }

  public static newInstance(): Shops {
    let result = new Shops();
    return result;
  }
}
