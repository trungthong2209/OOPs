 
import ClassInfo from './ClassInfo';
import Constants from './Constants';
import ValidationRule from '../utilities/validation/ValidationRule';

abstract class BaseObj{
    public _id: string;
    
    constructor() { 
        this._id = null; 
    }

    public handleError(error: Error) {     
        throw error;
    }

    public log(message: string) {       
    }

    public static activator<T>(type: { new (): T; }): T {
        return new type();
    }

	public getValidationRules(): Array<ValidationRule> {
        let self: any = this;
        return self.__proto__.__validationRules || [];
    }

    public arrayLength(array: Array<any>): number{
        if (array == null)
            return 0;

        return array.length;
    }

    public assign(data: any){
        throw Error(Constants.ERROR_NOT_IMPLMENTED);
    }
}

export default BaseObj;

