import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import RawMaterialsInputManager from "../../fwg.pickdy.pos.common/model/manager/RawMaterialsInputManager";
import RawMaterialInput from "../../fwg.pickdy.pos.common/model/RawMaterialInputs";
import RawMaterialsManager from "../../fwg.pickdy.pos.common/model/manager/RawMaterialsManager";
import RawMaterials from "../../fwg.pickdy.pos.common/model/RawMaterials";
import RawMaterialsReportCriterial from "../../fwg.pickdy.pos.common/model/RawMaterialsReportCriterial";
import { IsoDateHelper } from "../../fwg.pickdy.common/utilities/helpers/IsoDateHelper";
import RawMaterialsReport from "../../fwg.pickdy.pos.common/model/RawMaterialsReport";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class RawMaterialinputService {
  protected rawMaterialsInputManager: RawMaterialsInputManager;
  protected rawMaterialsManager: RawMaterialsManager;
  constructor(user: Staffs) {
    this.rawMaterialsInputManager = new RawMaterialsInputManager(user);
    this.rawMaterialsManager = new RawMaterialsManager(user);
  }
  /**
   * get all Categories and Product Items Counts      
   */
  public getAllRawMaterialInputs(): Promise<HttpStatus<Array<RawMaterialInput>>> {
    let promise = new Promise<HttpStatus<Array<RawMaterialInput>>>((resolve, reject) => {
      let pipeList: Array<any> = [
        { "$addFields": { "rawMaterialIdObj": { "$toObjectId": "$rawMaterialId" } } },
        {
          $lookup:
          {
            from: "rawMaterials",
            localField: "rawMaterialIdObj",
            foreignField: "_id",
            as: "rawMaterialsName"
          }
        },
        {
          $project:
          {
            name: 1,
            amount: 1,
            createByUserId: 1,
            updateByUserId: 1,
            createDateTime: 1,
            updateDateTime: 1,
            shopId: 1,
            reason: 1,
            rawMaterialId: 1,
            rawMaterialName: { $ifNull: [{ $arrayElemAt: ["$rawMaterialsName.name", 0] }, ""] }
          }
        }
      ];
      this.rawMaterialsInputManager.classInfo.mongoGetAggregate = pipeList;
      this.rawMaterialsInputManager.classInfo.mongoCollectionName = 'rawMaterialInputs';
      this.rawMaterialsInputManager.search(null).then((httpStatus: HttpStatus<Array<RawMaterialInput>>) => {
        this.rawMaterialsInputManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-RawMaterialinputService-getAllRawMaterialInputs ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        this.rawMaterialsInputManager.classInfo.mongoGetAggregate = null;
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  public insertRawMaterialInputs(rawMaterialInput: RawMaterialInput): Promise<HttpStatus<RawMaterialInput>> {
    let promise = new Promise<HttpStatus<RawMaterialInput>>((resolve, reject) => {
      this.rawMaterialsInputManager.insert(rawMaterialInput).then((httpStatus: HttpStatus<RawMaterialInput>) => {
        this.rawMaterialsManager.get({ _id: this.rawMaterialsManager.objectID(rawMaterialInput.rawMaterialId) }).then((rawMaterialsGet: HttpStatus<RawMaterials>) => {
          let rawMaterials: RawMaterials = rawMaterialsGet.entity;
          if (rawMaterialInput.actionType === 'INCREASE' || rawMaterialInput.actionType === 'BILL_RETURN') {
            rawMaterials.amountRemain = rawMaterials.amountRemain + rawMaterialInput.amount;
          } else {
            rawMaterials.amountRemain = rawMaterials.amountRemain - rawMaterialInput.amount;
          }
          if (rawMaterials.amountRemain < 0) {
            rawMaterials.amountRemain = 0;
          }
          this.rawMaterialsManager.update({ _id: this.rawMaterialsManager.objectID(rawMaterials._id) }, rawMaterials).then((httpStatusUpdate: HttpStatus<RawMaterials>) => {
            resolve(httpStatus);
          }).catch((err) => {
            PickdyLogHelper.error('SERVICE-RawMaterialinputService-insertRawMaterialInputs ' + JSON.stringify(err) + ' --data --' + JSON.stringify(rawMaterials));
            reject(HttpStatus.getHttpStatus(err));
          });
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-RawMaterialinputService-insertRawMaterialInputs ' + JSON.stringify(err) + ' --data --' + JSON.stringify(rawMaterialInput));
          reject(HttpStatus.getHttpStatus(err));
        });
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-RawMaterialinputService-insertRawMaterialInputs ' + JSON.stringify(err) + ' --data --' + JSON.stringify(rawMaterialInput));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  /**
   * get all Categories and Product Items Counts      
   */
  public getRawMaterialInputHistory(rawMaterialsReportPamram: RawMaterialsReport): Promise<HttpStatus<Array<RawMaterialInput>>> {
    let promise = new Promise<HttpStatus<Array<RawMaterialInput>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditionsRawMeterialinput(rawMaterialsReportPamram.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        "$group":
        {
          "_id": {
            "_id": "$rawMaterialId",
            "actionType": "$actionType"
          },
          "amount": { "$sum": "$amount" }
        }
      },
        {
          $project: {
            "_id": "$_id._id",
            "actionType": "$_id.actionType",
            "amount": "$amount"
          }
        });
      this.rawMaterialsInputManager.classInfo.mongoGetAggregate = pipeList;
      this.rawMaterialsInputManager.classInfo.mongoCollectionName = 'rawMaterialInputs';
      this.rawMaterialsInputManager.search({}).then((httpStatus: HttpStatus<Array<RawMaterialInput>>) => {
        this.rawMaterialsInputManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.rawMaterialsInputManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-RawMaterialinputService-getRawMaterialInputHistory ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  private getConditionsRawMeterialinput(searchCriterial: RawMaterialsReportCriterial): Array<any> {
    let conditionList: Array<any> = [];
    if (this.isNotBlank(searchCriterial.fromDate)) {
      let fromDate = searchCriterial.fromDate;
      let toDate = fromDate;
      if (this.isNotBlank(searchCriterial.toDate)) {
        toDate = searchCriterial.toDate;
      }
      let fromDt = IsoDateHelper.convertIsoDate(fromDate + 'T' + searchCriterial.fromTime + ':00.000Z');
      let toDt = IsoDateHelper.convertIsoDate(toDate + 'T' + searchCriterial.toTime + ':00.000Z');
      conditionList.push({
        'createDateTime': { $gte: fromDt, $lt: toDt }
      });
    }
    if (conditionList.length == 0) {
      let date = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh').toISOString().substring(0, 10),
        timeFrom = "00:00",
        timeTo = "23:59";
      let fromDt = IsoDateHelper.convertIsoDate(date + 'T' + timeFrom + ':00.000Z');
      let toDt = IsoDateHelper.convertIsoDate(date + 'T' + timeTo + ':00.000Z');
      conditionList.push({
        'createDateTime': { $gte: fromDt, $lt: toDt }
      });
    }
    return conditionList;
  }
  private isNotBlank(value: any): boolean {
    return value !== null && value !== undefined && (value.length === undefined || value.length > 0);
  }
}