import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import TablesManager from "../../fwg.pickdy.pos.common/model/manager/TableManager";
import Tables from "../../fwg.pickdy.pos.common/model/Tables";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class TablesService {
  protected tablesManager: TablesManager;
  constructor(user: Staffs) {
    this.tablesManager = new TablesManager(user);
  }
  /**
   * get all Categories and Product Items Counts      
   */
  public genTables(tableParam: Tables): Promise<HttpStatus<Array<Tables>>> {
    let promise = new Promise<HttpStatus<Array<Tables>>>((resolve, reject) => {
      this.tablesManager.search({}).then((httpStatus: HttpStatus<Array<Tables>>) => {
        let tableList = new Array<Tables>();
        let indexTable: number = 0;
        if (httpStatus.entity != null && httpStatus.entity.length > 0) {
          indexTable = httpStatus.entity.length;
        }
        for (let i: number = 1; i <= tableParam.numberTables; i++) {
          let table: Tables = new Tables();
          indexTable = indexTable + 1;
          table.tableName = "" + indexTable;
          if (tableParam.floor != null) {
            table.floor = tableParam.floor;
          }
          tableList.push(table);
        }
        this.tablesManager.insertMany(tableList).then((httpStatus: HttpStatus<Array<Tables>>) => {
          resolve(httpStatus);
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-TablesService-genTables ' + JSON.stringify(err) + ' --data --' + JSON.stringify(tableList));
          reject(HttpStatus.getHttpStatus(err));
        });
      });
    });
    return promise;
  }
}