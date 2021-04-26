let Promise = require("promise");
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import Table from "../Tables";
export default class TablesManager extends BaseHelper<Table> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "tables";
    this.classInfo.type = Table;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "tables";
  }

  public createObject(data): Promise<Table> {
    let promise = new Promise((resolve, reject) => {
      let obj = new Table();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: Table, data: any) {
    obj._id = data._id;
    obj.tableName = data.tableName;
    obj.shopId = data.shopId ? this.objectID(data.shopId) : null;   
    obj.top = data.top;
    obj.left = data.left;
    obj.radius = data.discount;
    obj.width = data.width;
    obj.height = data.height;
    obj.scaleX = data.scaleX;
    obj.scaleY = data.scaleY;
    obj.angle = data.angle;   
    obj.shape = data.shape;
    obj.seats = data.seats;
    obj.floor = data.floor;
    obj.createByUserId = data.createByUserId;
    obj.updateByUserId = data.updateByUserId;
    obj.createDateTime = data.createDateTime;
    obj.updateDateTime = data.updateDateTime;
    obj.numberTables = data.numberTables;
    obj.tableType = data.tableType;  
  }

  public newInstance() {
    return new Table();
  }
}
