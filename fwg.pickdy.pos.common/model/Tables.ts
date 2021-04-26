import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import Constants from "../base/Constants";
export default class Tables extends BaseEntity<Tables> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  public tableName: string;
  @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
  public shopId: string=null;
  public top: number = 0;
  public left: number= 0;
  public radius: number= 0;
  public width: number= 0;
  public height: number= 0;
  public scaleX: number= 0;
  public scaleY: number= 0;
  public angle: number= 0; 
  public shape: string = '';
  public seats: number= 0;
  public floor: string= '1';
  public createByUserId: string=null;
  public updateByUserId: string=null;
  public createDateTime: Date=null;
  public updateDateTime: Date=null;
  @IgnoreDecorator.ignoreInDb()
  public numberTables: number;
  public tableType: string='DINEIN';
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.tableName = obj.hasOwnProperty("tableName")
      ? obj.tableName
      : this.tableName;
    this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;    
    this.top = obj.hasOwnProperty("top") ? obj.top : this.top;
    this.left = obj.hasOwnProperty("left") ? obj.left : this.left;
    this.radius = obj.hasOwnProperty("radius") ? obj.radius : this.radius;
    this.width = obj.hasOwnProperty("width") ? obj.width : this.width;
    this.height = obj.hasOwnProperty("height") ? obj.height : this.height;
    this.scaleX = obj.hasOwnProperty("scaleX") ? obj.scaleX : this.scaleX;
    this.scaleY = obj.hasOwnProperty("scaleY") ? obj.scaleY : this.scaleY;
    this.angle = obj.hasOwnProperty("angle") ? obj.angle : this.angle;    
    this.shape = obj.hasOwnProperty("shape") ? obj.shape : this.shape;
    this.seats = obj.hasOwnProperty("seats") ? obj.seats : this.seats;
    this.floor = obj.hasOwnProperty("floor") ? obj.floor : this.floor;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    this.numberTables = obj.hasOwnProperty("numberTables") ? obj.numberTables : this.numberTables;
    this.tableType = obj.hasOwnProperty("tableType") ? obj.tableType : this.tableType;
  }
  public static newInstance(): Tables {
    let result = new Tables();
    return result;
  }
}
