import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Price from "./Price";
import ProductItemRawMaterial from "./ProductItemRawMaterial";
import Constants from "../base/Constants";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
export default class ProductItems extends BaseEntity<ProductItems> {
    @ValidationDecorator.required(Constants.NAME_REQUIRE)
    productName: string;
    priceDefault: number = 0;
    unitType: string=null;    
    @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
    shopId: string;
    categories: string=null;    
    currency: string;
    rawMaterials:Array<ProductItemRawMaterial>=null;    
    prices: Array<Price>=null;    
    printers: string;
    image:string;
    itemAdditionals:Array<string>;
    createByUserId: string=null;    
    updateByUserId: string=null;    
    createDateTime: Date=null;    
    updateDateTime: Date=null;    
    productType: string;
    @IgnoreDecorator.ignoreInDb()
    categoryName: string;
    minValue:number = 0;
    maxValue:number = 0;
    description:string;
    sellOnline : boolean =false;
    @IgnoreDecorator.ignoreInDb()
    shopName: string;
    constructor() {
      super();
      this.itemAdditionals = new Array<string>();
      this.rawMaterials = new Array<ProductItemRawMaterial>();      
      this.prices = new Array<Price>();
    }

    public assign(obj: any) {
      this._id = obj._id;
      this.productName = obj.hasOwnProperty("productName") ? obj.productName  : this.productName;
      this.priceDefault = obj.hasOwnProperty("priceDefault") ? obj.priceDefault  : this.priceDefault;
      this.unitType = obj.hasOwnProperty("unitType") ? obj.unitType : this.unitType;
      this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
      this.categories = obj.hasOwnProperty("categories")? obj.categories : this.categories;
      this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
      this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.menuName  : this.updateByUserId;
      this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
      this.updateDateTime = obj.hasOwnProperty("updateDateTime")  ? obj.updateDateTime  : this.updateDateTime;
      this.currency = obj.hasOwnProperty("currency") ? obj.currency  : this.currency;
      this.rawMaterials = obj.hasOwnProperty("rawMaterials")  ? obj.rawMaterials  : this.rawMaterials;
      this.prices = obj.hasOwnProperty("prices")  ? obj.prices  : this.prices;
      this.printers = obj.hasOwnProperty("printers")  ? obj.printers  : this.printers;
      this.image = obj.hasOwnProperty("image")  ? obj.image  : this.image;
      this.itemAdditionals = obj.hasOwnProperty("itemAdditionals")  ? obj.itemAdditionals  : this.itemAdditionals;
      this.categoryName = obj.hasOwnProperty("categoryName")  ? obj.categoryName  : this.categoryName;
      this.productType = obj.hasOwnProperty("productType")  ? obj.productType  : this.productType;
      this.minValue = obj.hasOwnProperty("minValue")  ? obj.minValue  : this.minValue;
      this.maxValue = obj.hasOwnProperty("maxValue")  ? obj.maxValue  : this.maxValue;
      this.description = obj.hasOwnProperty("description")  ? obj.description  : this.description;
      this.sellOnline = obj.hasOwnProperty("sellOnline")  ? obj.sellOnline  : this.sellOnline;
      this.shopName = obj.hasOwnProperty("shopName")  ? obj.shopName  : this.shopName;
      
    }   

    public static newInstance(): ProductItems {
      let result = new ProductItems();
      return result;
    }
}
