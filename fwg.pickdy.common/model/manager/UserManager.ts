let Promise = require("promise");
import BaseHelper from "../../base/BaseHelper";
import User from "../../../fwg.pickdy.common/model/User";
import Constants from "../../base/Constants";
import HttpStatus from "../../base/HttpStatus";

export default class UserManager extends BaseHelper<User> {
  
  constructor(user: User) {
      super(user);
      this.classInfo.mongoCollectionName = 'users';
      this.classInfo.endPoint = "users"
      this.classInfo.type = User;
      this.classInfo.dbType = Constants.DB_TYPES.MONGO;
      this.classInfo.cacheType = Constants.CACHE_REDIS;
      this.classInfo.nameSpace = "fwg.pickdy.common";   
  }

  public createObject(data): Promise<User> {
    let promise = new Promise((resolve, reject) => {
      let obj = new User();
      this.assignObject(obj, data);
      resolve(obj);
  });
  return promise;
  }

  public assignObject(obj: User, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.auth0UserId = data.auth0UserId;
    obj.firstName = data.firstName;
    obj.lastName = data.lastName;
    obj.email = data.email;
    obj.notificationTokens = data.notificationTokens;
    obj.token = data.token;
    obj.mobile = data.mobile;
    obj.password = data.password;
  } 
  public newInstance() {
    return new User();
  }
}
