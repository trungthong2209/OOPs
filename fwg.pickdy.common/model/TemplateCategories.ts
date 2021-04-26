import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import Constants from "../../fwg.pickdy.pos.common/base/Constants";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";

export default class TemplateCategories extends BaseEntity<TemplateCategories> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE) 
  categoryName: string = '';  
  code : string = '';  
  categoryType : string= 'NORMAL';// NORMAL,NOON
  businessModelId: string='';
  constructor() {
    super();   
  }
  public assign(obj: any) {
    this._id = obj._id;
    this.categoryName = obj.hasOwnProperty("categoryName")  ? obj.categoryName : this.categoryName;
    this.code = obj.hasOwnProperty("code") ? obj.code : this.code;       
    this.categoryType = obj.hasOwnProperty("categoryType") ? obj.categoryType : this.categoryType;	
    this.businessModelId = obj.hasOwnProperty("businessModelId") ? obj.businessModelId : this.businessModelId;	  
  }
  public static newInstance(): TemplateCategories {
    let result = new TemplateCategories();
    return result;
  }
}
