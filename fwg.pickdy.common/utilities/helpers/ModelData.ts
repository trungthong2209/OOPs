import BaseObj from '../../base/BaseObj';
import IgnoreAttribute from '../ignore-helper/IgnoreAttribute';
class ModelDataHelper {
    public bindingModelData(obj: any, typeRemove: boolean = false) {
        let validationMessages: Array<string> = new Array<string>();
        let ignoreRules = this.getHandlerAttribute(obj);
        if (ignoreRules != undefined && ignoreRules != null) {
            for (let rule of ignoreRules) {
                if (rule.ignoreInDb === true) {
                    delete obj[rule.propertyName];
                }
            }
        }
        this.removeContentObject(obj);
        for (var key in obj) {
            if (obj[key] instanceof Array) {
                for (let entry of obj[key]) {
                    this.bindingModelData(entry);
                }
            }
        }
    }
    public getObjectContent<T extends BaseObj>(obj: T): any {
        let result: any = {};
        let ignoreRules = this.getHandlerAttribute(obj);
        if (ignoreRules != undefined && ignoreRules != null) {
            for (let rule of ignoreRules) {
                if (rule.ignoreInDb === true) {
                    delete obj[rule.propertyName];
                }
            }
        }
        let array = Object.keys(obj);
        array.forEach(key => {
            result[key] = obj[key];
            if(key.indexOf('__') !== 0){
                result[key] = obj[key];
            }            
        })
        return result;
    }
    private getHandlerAttribute(obj: any): Array<IgnoreAttribute> {
        return obj.__proto__.__ignoreRules;
    }
    private isArray(a) {
        return (!!a) && (a.constructor === Array);
    };
    public removeContentObject(obj: any) {
        // remove all of this before save
        if (obj.__proto__ == null) return;
        if (obj.__proto__.__ignoreRules != null && obj.__proto__.__ignoreRules != undefined) {
            obj.__proto__.__ignoreRules = undefined;
            delete obj.__proto__.__ignoreRules;
        }

        if (obj.__proto__.__validationRules != null && obj.__proto__.__validationRules != undefined) {
            obj.__proto__.__validationRules = undefined;
            delete obj.__proto__.__validationRules;
        }


        if (obj.__proto__ != null && obj.__proto__ != undefined) {
            this.removeContentObject(obj.__proto__);
        }
    }
}
var ModelData = new ModelDataHelper();
export default ModelData;