let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import HttpStatus from "../../../fwg.pickdy.common/base/HttpStatus";
export default class StaffsManager extends BaseHelper<Staffs> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "staffs";
    this.classInfo.type = Staffs;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "staffs";
  }

  public createObject(data): Promise<Staffs> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Staffs();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Staffs, data: any) {
    obj._id = data._id;       
    obj.shopId = data.shopId;
    obj.fullName = data.fullName;    
    obj.email = data.email;
    obj.userName = data.userName;
    obj.password = data.password;
    obj.tel = data.tel;
    obj.role = data.role;
    obj.token = data.token;
    obj.confirmPassword = data.confirmPassword;
    obj.dataAccess = data.dataAccess;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
    obj.ownerShop = data.ownerShop;
    obj.tokendevice = data.tokendevice;
    obj.loginMode = data.loginMode;
  }   

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new Staffs();
  }
}
