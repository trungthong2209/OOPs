let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import HttpStatus from "../../../fwg.pickdy.common/base/HttpStatus";
import ProductItems from "../ProductItems";
import TemplateProductItems from "../TemplateProductItems";
import User from "../User";
export default class TemplateProductItemsManager extends BaseHelper<TemplateProductItems> {
  constructor(user: User) {
    super(user);
    this.classInfo.mongoCollectionName = "templateProductItems";
    this.classInfo.type = ProductItems;
    this.classInfo.nameSpace = "fwg.pickdy.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "templateProductItems";
  }

  public createObject(data): Promise<TemplateProductItems> {
    let promise = new Promise((resolve, reject) => {
      let obj = new TemplateProductItems();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }
  public assignObject(obj: TemplateProductItems, data: any) {
    obj._id = data._id;
    obj.productName = data.productName;    
    obj.priceDefault = data.priceDefault;
    obj.unitType = data.unitType;
    obj.categories = data.categories ? data.categories : null;
    obj.currency = data.currency; 
    obj.image = data.image;
    obj.minValue = data.minValue;
    obj.maxValue = data.maxValue;
    obj.description = data.description;
    obj.sellOnline = data.sellOnline;
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new TemplateProductItems();
  }
}
