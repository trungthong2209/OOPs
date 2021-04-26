let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import RawMaterialInput from "../RawMaterialInputs";
export default class RawMaterialsInputManager extends BaseHelper<RawMaterialInput> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "rawMaterialInputs";
    this.classInfo.type = RawMaterialInput;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "rawMaterialInputs";
  }

  public createObject(data): Promise<RawMaterialInput> {
    let promise = new Promise((resolve, reject) => {
      let obj = new RawMaterialInput();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: RawMaterialInput, data: any) {
    obj._id = data._id;
    obj.amount = data.amount;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
    obj.rawMaterialId = data.rawMaterialId? data.rawMaterialId : null;   
    obj.reason = data.reason;
    obj.createByUserId = data.createByUserId;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;  
    obj.rawMaterialName = data.rawMaterialName;  
    obj.actionType = data.actionType;  
  }
  public newInstance() {
    return new RawMaterialInput();
  }
}
