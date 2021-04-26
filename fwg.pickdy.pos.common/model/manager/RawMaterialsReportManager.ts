let Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import Staffs from "../Staffs";
import RawMaterialsReport from "../RawMaterialsReport";

export default class RawMaterialsReportManager extends BaseHelper<RawMaterialsReport> {
  constructor(user: Staffs) {
    super(user);
    this.classInfo.mongoCollectionName = "rawMaterialInputs";
    this.classInfo.type = RawMaterialsReport;
    this.classInfo.nameSpace = "fwg.pickdy.pos.common";
    this.classInfo.dbType = Constants.DB_TYPES.MONGO;
    this.classInfo.cacheType = Constants.CACHE_REDIS;
    this.classInfo.endPoint = "reports";
  }

  public createObject(data): Promise<RawMaterialsReport> {
    let promise = new Promise((resolve, reject) => {
      let obj = new RawMaterialsReport();
      this.assignObject(obj, data);
      resolve(obj);
    });
    return promise;
  }

  public assignObject(obj: RawMaterialsReport, data: any) {   
    obj.searchCriterial = data.searchCriterial;    
    obj.rawMaterials = data.rawMaterials;    
    
  }
  public newInstance() {
    return new RawMaterialsReport();
  }
}
