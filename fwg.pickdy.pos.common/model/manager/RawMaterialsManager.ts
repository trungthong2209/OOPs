let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import RawMaterials from '../RawMaterials';
export default class RawMaterialsManager extends BaseHelper<RawMaterials> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "rawMaterials";
    this.classInfo.type = RawMaterials;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "rawMaterials";
  }

  public createObject(data): Promise<RawMaterials> {
    let promise = new Promise((resolve, reject) => {
      let obj = new RawMaterials();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: RawMaterials, data: any) {
    obj._id = data._id;
    obj.name = data.name;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
    obj.unitId = data.unitId? data.unitId : null;
    obj.amountRemain = data.amountRemain;
    obj.createByUserId = data.createByUserId;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.minAmount = data.minAmount;
    obj.unitName = data.unitName;
    obj.rawMaterialType = data.rawMaterialType;
  }

  public newInstance() {
    return new RawMaterials();
  }
}
