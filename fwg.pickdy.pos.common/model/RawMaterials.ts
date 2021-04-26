import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
export default class RawMaterials extends BaseEntity<RawMaterials> {
    
    @ValidationDecorator.required(Constants.NAME_REQUIRE)
    name: string;    
    unitId: string=null;    
    @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
    shopId: string;
    amountRemain: number=0;
    createByUserId: string=null;    
    updateByUserId: string=null;    
    createDateTime: Date=null;    
    updateDateTime: Date=null;    
    minAmount:number;
    @IgnoreDecorator.ignoreInDb()
    unitName: string;
    rawMaterialType:string = "MATERIAL";//OR INVENTORY  
    constructor() {
    super();
    }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.unitId = obj.hasOwnProperty("unitId") ? obj.unitId : this.unitId;
    this.amountRemain = obj.hasOwnProperty("amountRemain") ? obj.amountRemain : this.amountRemain;
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
    this.createByUserId = obj.hasOwnProperty("createByUserId")? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId")? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    this.minAmount = obj.hasOwnProperty("minAmount")  ? obj.minAmount : this.minAmount;
    this.unitName = obj.hasOwnProperty("unitName")  ? obj.unitName : this.unitName; 
    this.rawMaterialType = obj.hasOwnProperty("rawMaterialType")  ? obj.rawMaterialType : this.rawMaterialType;   
     
  }
  public static newInstance(): RawMaterials {
    let result = new RawMaterials();
    return result;
  }
}
