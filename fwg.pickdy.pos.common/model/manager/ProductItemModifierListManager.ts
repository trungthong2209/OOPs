let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import ProductItemModifierList from "../ProductItemModifierList";


export default class ProductItemModifierListManager extends BaseHelper<ProductItemModifierList> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "productItemModifier";
    this.classInfo.type = ProductItemModifierList;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "productItemModifier";
  }

  public createObject(data): Promise<ProductItemModifierList> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ProductItemModifierList();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: ProductItemModifierList, data: any) {   
    obj.productItems = data.productItems;    
    obj.productItemModifiers = data.productItemModifiers;  
  }
  public newInstance() {
    return new ProductItemModifierList();
  }
}
