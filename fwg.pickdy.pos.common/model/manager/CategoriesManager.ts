let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Categories from "../Categories";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";

export default class CategoriesManager extends BaseHelper<Categories> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "categories";
    this.classInfo.type = Categories;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "categories";
  }

  public createObject(data): Promise<Categories> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Categories();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Categories, data: any) {
    obj._id = data._id;
    obj.categoryName = data.categoryName;
    obj.parentCategoryId = data.parentCategoryId ? data.parentCategoryId  : null;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
    obj.code = data.code; 
    obj.productItemCounts = data.productItemCounts;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
    obj.categoryType = data.categoryType;
  }
  public newInstance() {
    return new Categories();
  }
}
