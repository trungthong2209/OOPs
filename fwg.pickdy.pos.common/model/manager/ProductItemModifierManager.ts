let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import HttpStatus from "../../../fwg.pickdy.common/base/HttpStatus";
import ProductItemModifier from "../ProductItemModifier";
export default class ProductItemModifierManager extends BaseHelper<ProductItemModifier> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "productItemModifier";
    this.classInfo.type = ProductItemModifier;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "productItemModifier";
  }

  public createObject(data): Promise<ProductItemModifier> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ProductItemModifier();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }
  public assignObject(obj: ProductItemModifier, data: any) {
    obj._id = data._id;
    obj.productName = data.productName;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
    obj.price = data.price;
    obj.unitType = data.unitType;   
    obj.currency = data.currency;
    obj.rawMaterials = data.rawMaterials;    
    obj.image = data.image;   
    obj.createByUserId = data.createByUserId;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime; 
    obj.minValue = data.minValue;
    obj.maxValue = data.maxValue;
    obj.productItemParrentId = data.productItemParrentId;
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new ProductItemModifier();
  }
}
