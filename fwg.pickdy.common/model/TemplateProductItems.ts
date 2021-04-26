import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
export default class TemplateProductItems extends BaseEntity<TemplateProductItems> {
    @ValidationDecorator.required(Constants.NAME_REQUIRE)
    productName: string;
    priceDefault: number = 0;
    unitType: string=null;  
    categories: string=null;    
    currency: string;      
    image:string;  
    minValue:number = 0;
    maxValue:number = 0;
    description:string;
    sellOnline : boolean =false;
    constructor() {
      super();           
    }

    public assign(obj: any) {
      this._id = obj._id;
      this.productName = obj.hasOwnProperty("productName") ? obj.productName  : this.productName;
      this.priceDefault = obj.hasOwnProperty("priceDefault") ? obj.priceDefault  : this.priceDefault;
      this.unitType = obj.hasOwnProperty("unitType") ? obj.unitType : this.unitType;
      this.categories = obj.hasOwnProperty("categories")? obj.categories : this.categories;     
      this.currency = obj.hasOwnProperty("currency") ? obj.currency  : this.currency;           
      this.image = obj.hasOwnProperty("image")  ? obj.image  : this.image;      
      this.minValue = obj.hasOwnProperty("minValue")  ? obj.minValue  : this.minValue;
      this.maxValue = obj.hasOwnProperty("maxValue")  ? obj.maxValue  : this.maxValue;
      this.description = obj.hasOwnProperty("description")  ? obj.description  : this.description;
      this.sellOnline = obj.hasOwnProperty("sellOnline")  ? obj.sellOnline  : this.sellOnline;   
      
    } 
    
    public static newInstance(): TemplateProductItems {
      let result = new TemplateProductItems();
      return result;
    }
}
