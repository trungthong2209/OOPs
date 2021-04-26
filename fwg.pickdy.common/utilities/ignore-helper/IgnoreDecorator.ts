 
import IgnoreAttribute from '../ignore-helper/IgnoreAttribute'; 

class IgnoreDecoratorHelper {
    public static initIgnoreRules(target: any) {
        if (target.__ignoreRules === undefined || target.__ignoreRules === null) {
            target.__ignoreRules = Array<IgnoreAttribute>();
        }
    }

    public ignoreInDb() {
        return (target: any, propertyKey: string) => {
            IgnoreDecoratorHelper.initIgnoreRules(target);
            let ignoreRule: any = new  IgnoreAttribute();
            ignoreRule.propertyName = propertyKey;
            ignoreRule.ignoreInDb = true;
            target.__ignoreRules.push(ignoreRule);
        }
    }

    public ignoreInUI() {
        return (target: any, propertyKey: string) => {
            IgnoreDecoratorHelper.initIgnoreRules(target);
            let ignoreRule :any = new  IgnoreAttribute();
            ignoreRule.propertyName = propertyKey;
            ignoreRule.ignoreinUI = true;
            target.__ignoreRules.push(ignoreRule);
        }
    }
}



var IgnoreDecorator = new IgnoreDecoratorHelper();
export default IgnoreDecorator;