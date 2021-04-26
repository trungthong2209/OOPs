import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import ProductItems from "./ProductItems";
import ProductItemModifier from "./ProductItemModifier";
export default class ProductItemModifierList extends BaseEntity<ProductItemModifierList> {  
  productItems:ProductItems;
  productItemModifiers:Array<ProductItemModifier>;    
  constructor() {
    super();     
    this.productItemModifiers = new Array<ProductItemModifier>();      
  }
  public assign(obj: any) {     
    this.productItems = obj.hasOwnProperty("productItems")  ? obj.productItems  : this.productItems;
    this.productItemModifiers = obj.hasOwnProperty("productItemModifiers")  ? obj.productItemModifiers  : this.productItemModifiers;
  }   
  public static newInstance(): ProductItemModifierList {
    let result = new ProductItemModifierList();
    return result;
  }
}
