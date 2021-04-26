import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../../fwg.pickdy.pos.common/base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";


export default class DataAccess extends BaseEntity<DataAccess> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE) 
  name: string ;
  @ValidationDecorator.required(Constants.DATAACCESS.ROLE_REQUIRE) 
  role: string = null;  
  constructor() {
    super();
    
  }
  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name")  ? obj.name : this.name;
    this.role = obj.hasOwnProperty("role") ? obj.role : this.role;
  }
  public static newInstance(): DataAccess {
    let result = new DataAccess();
    return result;
  }
}
