import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Price from "./Price";
import ProductItemRawMaterial from "./ProductItemRawMaterial";
import Constants from "../base/Constants";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
export default class ProductItemModifier extends BaseEntity<ProductItemModifier> {
    @ValidationDecorator.required(Constants.NAME_REQUIRE)
    productName: string;
    price: number = 0;
    unitType: string=null;
    @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
    shopId: string;    
    currency: string='VND';
    rawMaterials:Array<ProductItemRawMaterial>;   
    image:string;    
    createByUserId: string=null;
    updateByUserId: string=null;
    createDateTime: Date=null;
    updateDateTime: Date=null;    
    minValue:number = 0;
    maxValue:number = 0;   
    @ValidationDecorator.required(Constants.PARENT_ID_REQUIRE)
    productItemParrentId : string;
    constructor() {
      super();     
      this.rawMaterials = new Array<ProductItemRawMaterial>();      
    }

    public assign(obj: any) {
      this._id = obj._id;
      this.productName = obj.hasOwnProperty("productName") ? obj.productName  : this.productName;
      this.price = obj.hasOwnProperty("price") ? obj.price  : this.price;
      this.unitType = obj.hasOwnProperty("unitType") ? obj.unitType : this.unitType;
      this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;     
      this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
      this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.menuName  : this.updateByUserId;
      this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
      this.updateDateTime = obj.hasOwnProperty("updateDateTime")  ? obj.updateDateTime  : this.updateDateTime;
      this.currency = obj.hasOwnProperty("currency") ? obj.currency  : this.currency;
      this.rawMaterials = obj.hasOwnProperty("rawMaterials")  ? obj.rawMaterials  : this.rawMaterials;     
      this.image = obj.hasOwnProperty("image")  ? obj.image  : this.image;
      this.minValue = obj.hasOwnProperty("minValue")  ? obj.minValue  : this.minValue;
      this.maxValue = obj.hasOwnProperty("maxValue")  ? obj.maxValue  : this.maxValue;   
      this.productItemParrentId = obj.hasOwnProperty("productItemParrentId")  ? obj.productItemParrentId  : this.productItemParrentId;    
    }   
    public static newInstance(): ProductItemModifier {
      let result = new ProductItemModifier();
      return result;
    }
}
