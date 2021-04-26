import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../../fwg.pickdy.pos.common/base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import ProductItems from "./ProductItems";

export default class Categories extends BaseEntity<Categories> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE) 
  categoryName: string = '';
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE) 
  shopId: string = null;
  parentCategoryId = null;
  code : string = '';
  @IgnoreDecorator.ignoreInDb()
  productItemCounts:number;
  createByUserId : string=null;
  updateByUserId : string=null;
  createDateTime : Date=null;
  updateDateTime : Date=null;
  categoryType : string= 'NORMAL';// NORMAL,NOON
  constructor() {
    super();   
  }
  public assign(obj: any) {
    this._id = obj._id;
    this.categoryName = obj.hasOwnProperty("categoryName")  ? obj.categoryName : this.categoryName;
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
    this.parentCategoryId = obj.hasOwnProperty("parentCategoryId") ? obj.parentCategoryId  : this.parentCategoryId;
    this.code = obj.hasOwnProperty("code") ? obj.code : this.code;    
    this.productItemCounts = obj.hasOwnProperty("productItemCounts") ? obj.productItemCounts : this.productItemCounts;  
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;  
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;  
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;  
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;  
    this.categoryType = obj.hasOwnProperty("categoryType") ? obj.categoryType : this.categoryType;	
  }
  public static newInstance(): Categories {
    let result = new Categories();
    return result;
  }
}
