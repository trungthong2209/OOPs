import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import ProductItems from "./ProductItems";
export default class Menus extends BaseEntity<Menus> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  menuName: string = "";
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
  shopId: string = null;  
  isActivated:boolean=true;
  effectDateTime:Date = null;
  endDateTime:Date = null;
  productItems: Array<string>;
  @IgnoreDecorator.ignoreInDb()
  productItemValues: Array<ProductItems>= new Array<ProductItems>();
  createByUserId : string=null;
  updateByUserId : string=null;
  createDateTime : Date=null;
  updateDateTime : Date=null;
  icon:string = "";
  @IgnoreDecorator.ignoreInDb()
  changeData:boolean=false;
  constructor() {
    super();
    this.productItemValues =new Array<ProductItems>();
    this.productItems =new Array<string>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.menuName = obj.hasOwnProperty("menuName") ? obj.menuName: this.menuName;
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
    this.isActivated = obj.hasOwnProperty("isActivated") ? obj.activated   : this.isActivated;
    this.effectDateTime = obj.hasOwnProperty("effectDateTime") ? obj.effectDateTime   : this.effectDateTime;
    this.endDateTime = obj.hasOwnProperty("endDateTime") ? obj.endDateTime   : this.endDateTime;
    this.icon = obj.hasOwnProperty("icon") ? obj.icon   : this.icon;
    this.productItems = obj.hasOwnProperty("productItems") ? obj.productItems   : this.productItems;
    this.productItemValues = obj.hasOwnProperty("productItemValues") ? obj.productItemValues   : this.productItemValues;     
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;  
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;  
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;  
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime; 
    this.changeData = obj.hasOwnProperty("changeData") ? obj.changeData   : this.changeData;   
  }

  public static newInstance(): Menus {
    let result = new Menus();
    return result;
  }
}
