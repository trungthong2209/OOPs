let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import HttpStatus from '../../../fwg.pickdy.common/base/HttpStatus';
import Menus from "../Menus";
import ProductItems from "../ProductItems";

export default class MenusManager extends BaseHelper<Menus> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "menus";
    this.classInfo.type = Menus;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "menus";
  }

  public createObject(data): Promise<Menus> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Menus();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Menus, data: any) {
    obj._id = data._id;
    obj.menuName = data.menuName;
    obj.isActivated = data.isActivated;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;
    obj.effectDateTime = data.effectDateTime;
    obj.endDateTime = data.endDateTime;
    obj.productItems = data.productItems;
    obj.productItemValues = data.productItemValues;  
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.createByUserId = data.createByUserId;
    obj.icon = data.icon;
    obj.changeData = data.changeData;
  }

  public delete(search: any): Promise<HttpStatus<boolean>> {
    return this.persistance.delete(this, search);
  }
  public newInstance() {
    return new Menus();
  }
}
