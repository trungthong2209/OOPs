import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
export default class RawMaterialInput extends BaseEntity<RawMaterialInput> {
  amount: number=0;
  @ValidationDecorator.required(Constants.RAWMATERIAL.RAWMATERIAL_ID_REQUIRE)
  rawMaterialId: string;
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
  shopId: string;
  createByUserId: string = null;
  updateByUserId: string = null;
  createDateTime: Date = null;
  updateDateTime: Date = null;
  reason: string; 
  actionType:string ='INCREASE';// INCREASE,DECREASE,BILL,'BILL_RETURN'
  @IgnoreDecorator.ignoreInDb()
  rawMaterialName: string;
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.rawMaterialId = obj.hasOwnProperty("rawMaterialId") ? obj.rawMaterialId : this.rawMaterialId;
    this.amount = obj.hasOwnProperty("amount") ? obj.amount : this.amount;
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;    
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.menuName : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    this.reason = obj.hasOwnProperty("reason") ? obj.reason : this.reason;
    this.rawMaterialName = obj.hasOwnProperty("rawMaterialName") ? obj.rawMaterialName : this.rawMaterialName;
    this.actionType = obj.hasOwnProperty("actionType") ? obj.actionType : this.actionType;
  }

  public static newInstance(): RawMaterialInput {
    let result = new RawMaterialInput();
    return result;
  }
}
