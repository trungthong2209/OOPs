let Promise = require("promise");
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import HttpStatus from "../../base/HttpStatus";
import LicensePackages from "../LicensePackages";
import User from "../User";
export default class TemplateProductItemsManager extends BaseHelper<LicensePackages> {
  constructor(user: User) {
    super(user);
    this.classInfo.mongoCollectionName = "licensePackages";
    this.classInfo.type = LicensePackages;
    this.classInfo.nameSpace = "fwg.pickdy.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "licensePackages";
  }

  public createObject(data): Promise<LicensePackages> {
    let promise = new Promise((resolve, reject) => {
      let obj = new LicensePackages();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }
  public assignObject(obj: LicensePackages, data: any) {
    obj._id = data._id;
    obj.licenseName = data.licenseName;    
    obj.price = data.price;
    obj.months = data.months;
    obj.applicationID = data.applicationID;
   
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new LicensePackages();
  }
}
