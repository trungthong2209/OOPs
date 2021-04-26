import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";

import RawMaterialsReportInOut from "./RawMaterialsReportInOut";
import RawMaterialsReportCriterial from "./RawMaterialsReportCriterial";
export default class RawMaterialsReport extends BaseEntity<RawMaterialsReport> {
  searchCriterial : RawMaterialsReportCriterial = null;  
  rawMaterials :Array<RawMaterialsReportInOut> = null;
  constructor() {
    super();
    this.searchCriterial =  new RawMaterialsReportCriterial();   
    this.rawMaterials = new Array<RawMaterialsReportInOut>();
  }
  public assign(obj: any) {
    this._id = obj._id;
    this.rawMaterials= obj.hasOwnProperty("rawMaterials") ? obj.rawMaterials : this.rawMaterials;
  }

  public static newInstance(): RawMaterialsReport {
    let result = new RawMaterialsReport();
    return result;
  }
}
