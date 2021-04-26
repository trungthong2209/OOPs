let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import HttpStatus from "../../../fwg.pickdy.common/base/HttpStatus";
import ProductItems from "../ProductItems";
export default class ProductItemsManager extends BaseHelper<ProductItems> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "productItems";
    this.classInfo.type = ProductItems;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "productItems";
  }

  public createObject(data): Promise<ProductItems> {
    let promise = new Promise((resolve, reject) => {
      let obj = new ProductItems();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }
  public assignObject(obj: ProductItems, data: any) {
    obj._id = data._id;
    obj.productName = data.productName;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
    obj.priceDefault = data.priceDefault;
    obj.unitType = data.unitType;
    obj.categories = data.categories ? data.categories : null;
    obj.currency = data.currency;
    obj.rawMaterials = data.rawMaterials;
    obj.printers = data.printers;
    obj.itemAdditionals = data.itemAdditionals;
    obj.image = data.image;
    obj.prices = data.prices;
    obj.createByUserId = data.createByUserId;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.categoryName = data.categoryName;
    obj.productType = data.productType;
    obj.minValue = data.minValue;
    obj.maxValue = data.maxValue;
    obj.description = data.description;
    obj.sellOnline = data.sellOnline;
    obj.shopName = data.shopName;
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new ProductItems();
  }
}
