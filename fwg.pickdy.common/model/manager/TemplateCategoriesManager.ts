let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import TemplateCategories from "../TemplateCategories";
import User from "../User";

export default class TemplateCategoriesManager extends BaseHelper<TemplateCategories> {
  constructor(user: User) {
    super(user);
    this.classInfo.mongoCollectionName = "templateCategories";
    this.classInfo.type = TemplateCategories;
    this.classInfo.nameSpace = "fwg.pickdy.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "templateCategories";
  }

  public createObject(data): Promise<TemplateCategories> {
    let promise = new Promise((resolve, reject) => {
      let obj = new TemplateCategories();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: TemplateCategories, data: any) {
    obj._id = data._id;
    obj.categoryName = data.categoryName;  
    obj.code = data.code;    
    obj.categoryType = data.categoryType;
    obj.businessModelId = data.businessModelId;
  }
  public newInstance() {
    return new TemplateCategories();
  }
}
