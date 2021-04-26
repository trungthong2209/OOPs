let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Categories from "../Categories";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import DataAccess from "../DataAccess";

export default class DataAccessManager extends BaseHelper<DataAccess> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "dataAccess";
    this.classInfo.type = Categories;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "dataAccess";
  }

  public createObject(data): Promise<DataAccess> {
    let promise = new Promise((resolve, reject) => {
      let obj = new DataAccess();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: DataAccess, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.role = data.role;       
  }
  public newInstance() {
    return new DataAccess();
  }
}
