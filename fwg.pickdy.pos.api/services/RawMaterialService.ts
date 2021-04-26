import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import RawMaterials from "../../fwg.pickdy.pos.common/model/RawMaterials";
import RawMaterialsManager from "../../fwg.pickdy.pos.common/model/manager/RawMaterialsManager";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class RawMaterialService {
  protected rawMaterialsManager: RawMaterialsManager;
  constructor(user: Staffs) {
    this.rawMaterialsManager = new RawMaterialsManager(user);
  }
  /**
   * get all Categories and Product Items Counts      
   */
  public getAllRawMaterials(rawMaterialType: any): Promise<HttpStatus<Array<RawMaterials>>> {
    let promise = new Promise<HttpStatus<Array<RawMaterials>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      if (rawMaterialType != null) {
        pipeList.push({
          $match: {
            $and: [{ 'rawMaterialType': rawMaterialType }]
          }
        });
      }
      pipeList.push(
        { "$addFields": { "unitIdC": { "$toObjectId": "$unitId" } } },
        {
          $lookup:
          {
            from: "units",
            localField: "unitIdC",
            foreignField: "_id",
            as: "unitNames"
          }
        },
        {
          $project:
          {
            name: 1,
            unitId: 1,
            createByUserId: 1,
            updateByUserId: 1,
            createDateTime: 1,
            updateDateTime: 1,
            amountRemain: 1,
            shopId: 1,
            minAmount: 1,
            rawMaterialType: 1,
            unitName: { $ifNull: [{ $arrayElemAt: ["$unitNames.name", 0] }, ""] }
          }
        }
      );
      this.rawMaterialsManager.classInfo.mongoGetAggregate = pipeList;
      this.rawMaterialsManager.classInfo.mongoCollectionName = 'rawMaterials';
      this.rawMaterialsManager.search(null).then((httpStatus: HttpStatus<Array<RawMaterials>>) => {
        this.rawMaterialsManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.rawMaterialsManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-RawMaterialService-getAllRawMaterials ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
}