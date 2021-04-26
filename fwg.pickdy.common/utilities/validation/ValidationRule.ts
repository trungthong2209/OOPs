export class ValidationScope {
    public static  Field = 0;
    public static  Class = 1;
 }

export default class ValidationRule {
    public className: string;
    public propertyName: string;
    public displayName: string;
    public validationType: string;
    public minLength: number;
    public maxLength: number;
    public regularExpression: string;
    public minValue: number;
    public maxValue: number;

    public errorMessage: string;
    public validationValue: any;
    public validationFunc: any;
    public validateScope: number = ValidationScope.Field;
};


