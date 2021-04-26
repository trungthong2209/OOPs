import ValidationRule from './ValidationRule';
import BaseEntity from '../../base/BaseEntity';
import BaseObj from '../../base/BaseObj';
import Constants from '../../base/Constants';

export class ValidatorHelper {

    public static validate<T extends BaseObj>(obj: BaseEntity<T>): string {
        return this.validateRecursively({"originalObject":obj});
    }

    /**
     * Recursively check each object in a nested JSON object for it's validation rules, and if one is violated return it's error message.
     * @param obj 
     */
    private static validateRecursively(obj)
    {
        let validationMessages = "";
        for (var key in obj)
        {
            if(key === "__proto__") continue; //don't iterate over __proto__, as potential circular references.
            if (typeof obj[key] == "object" && obj[key] != null) { //we only need to check objects, no need to check individual fields.
                validationMessages += this.validateRecursively(obj[key]);
                if(Array.isArray(obj[key])) {
                    continue;
                }
                let validationRules = ValidatorHelper.getValidationRules(obj[key]);
                let listIgnoreField = [];
                for (let validationRule of validationRules) {
                    if (validationRule.validationType == Constants.VALIDATORDECORATOR.IGNORE_VALIDATION) {
                        listIgnoreField.unshift(validationRule.propertyName);
                    }
                }
                for (let validationRule of validationRules) {
                    let exist = listIgnoreField.some(item => item == validationRule.propertyName)
                    if (!exist) {
                        let objValue = obj[key][validationRule.propertyName];
                        let checkValidation = validationRule.validationFunc(objValue, obj[key]);
                        if (!checkValidation){
                            validationMessages +=  validationRule.errorMessage + ",";
                        }
                    }
                }
            }
        }
        return validationMessages;
    }

    private static getValidationRules(obj: any): Array<ValidationRule> {
        let classNames:string = this.getInheritClassName((<any>obj));        
        if (obj.__proto__ && obj.__proto__.__validationRules) {
            let __validationRules:Array<ValidationRule> = (obj.__proto__.__validationRules)
            __validationRules = __validationRules.filter(item => classNames.indexOf(item.className) >= 0);
            return __validationRules;
        }
        else {
            return [];
        }
    }

    private static getInheritClassName(obj: any): string {
        if (<any>obj.__proto__ && (<any>obj.__proto__).constructor && (<any>obj.__proto__).constructor.name) {
            let classNames = (<any>obj.__proto__).constructor.name;
            return (<any>obj.__proto__).constructor.name + ', ' + this.getInheritClassName((<any>obj).__proto__);
        }
        else
            return '';
    }
}

/*
var Validator = new ValidatorHelper();
export default Validator;
*/