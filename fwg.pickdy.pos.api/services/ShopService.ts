import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import ShopsManager from "../../fwg.pickdy.pos.common/model/manager/ShopsManager";
import Shops from "../../fwg.pickdy.pos.common/model/Shops";
import * as QRCode from "qrcode";
import AppConfig from "../../fwg.pickdy.common/utilities/AppConfig";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class ShopService {
  protected shopsManager: ShopsManager;
  constructor(user: Staffs) {
    this.shopsManager = new ShopsManager(user);
  }
  /**
   * get all Categories and Product Items Counts      
   */
  public getAllShops(): Promise<HttpStatus<Array<Shops>>> {
    let promise = new Promise<HttpStatus<Array<Shops>>>((resolve, reject) => {
      let pipeList: Array<any> = [
        { "$addFields": { "ownerIdObj": { "$toObjectId": "$ownerId" } } },
        {
          $lookup:
          {
            from: "staffs",
            localField: "ownerIdObj",
            foreignField: "_id",
            as: "owner"
          }
        },
        {
          $project:
          {
            name: 1,
            subscriptionId: 1,
            orginizationId: 1,
            parentLocationId: 1,
            locationId: 1,
            shopId: 1,
            businessModel: 1,
            type: 1,
            tel: 1,
            address: 1,
            owner: { $ifNull: [{ $arrayElemAt: ["$owner", 0] }, ""] }
          }
        }
      ];
      this.shopsManager.classInfo.mongoGetAggregate = pipeList;
      this.shopsManager.search(null).then((httpStatus: HttpStatus<Array<Shops>>) => {
        this.shopsManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.shopsManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ShopService-getAllShops ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  /**
  * get all Categories and Product Items Counts      
  */
  public getShopById(shopId: string): Promise<HttpStatus<Shops>> {
    let promise = new Promise<HttpStatus<Shops>>((resolve, reject) => {
      let pipeList: Array<any> = [
        { $match: { _id: this.shopsManager.objectID(shopId) } },
        { "$addFields": { "ownerIdObj": { "$toObjectId": "$ownerId" } } },
        {
          $lookup:
          {
            from: "staffs",
            localField: "ownerIdObj",
            foreignField: "_id",
            as: "owner"
          }
        },
        {
          $project:
          {
            name: 1,
            subscriptionId: 1,
            orginizationId: 1,
            parentLocationId: 1,
            locationId: 1,
            shopId: 1,
            businessModel: 1,
            shopType: 1,
            tel: 1,
            address: 1,
            qrcode: 1,
            owner: { $ifNull: [{ $arrayElemAt: ["$owner", 0] }, ""] }
          }
        }
      ];
      this.shopsManager.classInfo.mongoGetAggregate = pipeList;
      this.shopsManager.get(null).then((httpStatus: HttpStatus<Shops>) => {
        this.shopsManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.shopsManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ShopService-getShopById ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  public insertShop(shops: Shops): Promise<HttpStatus<Shops>> {
    let promise = new Promise<HttpStatus<Shops>>((resolve, reject) => {
      this.shopsManager.create(shops).then((httpStatus: HttpStatus<Shops>) => {
        this.genQrCode(shops).then((httpStatusU: HttpStatus<Shops>) => {
          resolve(httpStatusU);
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-ShopService-insertShop ' + JSON.stringify(err) + ' --data --' + JSON.stringify(shops));
          reject(HttpStatus.getHttpStatus(err));
        });
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-ShopService-insertShop ' + JSON.stringify(err) + ' --data --' + JSON.stringify(shops));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  public genQrCode(shops: Shops): Promise<HttpStatus<Shops>> {
    let promise = new Promise<HttpStatus<Shops>>((resolve, reject) => {
      QRCode.toDataURL(AppConfig.GetConfiguration('WEB_HOST') + "/" + shops._id).then(url => {
        shops.qrcode = url;
        this.shopsManager.update({ _id: this.shopsManager.objectID(shops._id) }, shops).then((httpStatus: HttpStatus<Shops>) => {
          resolve(httpStatus);
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-ShopService-genQrCode ' + JSON.stringify(err) + ' --data --' + JSON.stringify(shops));
          reject(HttpStatus.getHttpStatus(err));
        });
      }).catch(err => {
        resolve(new HttpStatus<Shops>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
}