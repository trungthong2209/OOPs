import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
export default class TemplateUnits extends BaseEntity<TemplateUnits> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string;
  businessModelId: string='';
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name; 
    this.businessModelId = obj.hasOwnProperty("nambusinessModelIde") ? obj.businessModelId : this.businessModelId;       
  }

  public static newInstance(): TemplateUnits {
    let result = new TemplateUnits();
    return result;
  }
}
