import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
export default class Units extends BaseEntity<Units> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string;
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
  shopId: string;
  createByUserId: string=null;
  updateByUserId: string=null;
  createDateTime: string=null;
  updateDateTime: string=null;

  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
    this.createByUserId = obj.hasOwnProperty("createByUserId")? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId")? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
  }

  public static newInstance(): Units {
    let result = new Units();
    return result;
  }
}
