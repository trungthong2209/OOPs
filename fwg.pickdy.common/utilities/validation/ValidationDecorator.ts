
import ValidationRule from './ValidationRule';
import Constants from '../../base/Constants';
import { ValidationScope } from './ValidationRule';

let util = require('util');

export class ValidationHelper {

    public REG_EX_EMAIL = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    public REG_EX_PASSWORD = '^(?=.*\d)(?=.*[a-zA-Z]).{4,8}$';
    public REG_EX_PHONE = /^\(?(?:\+?61|0)(?:(?:2\)?[ -]?(?:3[ -]?[38]|[46-9][ -]?[0-9]|5[ -]?[0-35-9])|3\)?(?:4[ -]?[0-57-9]|[57-9][ -]?[0-9]|6[ -]?[1-67])|7\)?[ -]?(?:[2-4][ -]?[0-9]|5[ -]?[2-7]|7[ -]?6)|8\)?[ -]?(?:5[ -]?[1-4]|6[ -]?[0-8]|[7-9][ -]?[0-9]))(?:[ -]?[0-9]){6}|4\)?[ -]?(?:(?:[01][ -]?[0-9]|2[ -]?[0-57-9]|3[ -]?[1-9]|4[ -]?[7-9]|5[ -]?[018])[ -]?[0-9]|3[ -]?0[ -]?[0-5])(?:[ -]?[0-9]){5})$/;
    public VALIDATION_TYPE_STRING = 'VALID_STRING';
    public VALIDATION_TYPE_NUMBER = /^[0-9]*$/;
    public REX_TABLE_NUMBER = /^([1-9][0-9]*|(0)*[1-9][0-9]*)$/;
    public REX_FORMAT_TABLE_NUMBER = /^[0-9]*((\,|\/)[0-9]*)*$/;
    public REG_EX_DATE = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
    public REG_EX_TIME = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    public  validString(displayName: string, minLength: number, maxLength, regularExpression: string) {
        return function (target: any, propertyKey: string) {

            if (target.__validationRules == null) {
                target.__validationRules = new Array<ValidationRule>();
            }
            let validationRule = new ValidationRule();
            validationRule.className = target.constructor.name;
            validationRule.displayName = displayName;
            validationRule.propertyName = propertyKey;
            validationRule.minLength = minLength;
            validationRule.maxLength = maxLength;
            validationRule.regularExpression = regularExpression;
            validationRule.validationType = 'VALID_STRING';
            validationRule.errorMessage = 'String parse failed: String invalid.';
            validationRule.validationFunc = (data) => {
                return (data !== undefined && data !== null && data !== '' && (minLength ==null || data.length >= minLength) && (maxLength == null ||data.length <= maxLength) ) ? true : false;
            }

            target.__validationRules.push(validationRule);
        }
    }

    public  validNumber(displayName: string, minValue: number, maxValue, regularExpression: string, isInteger: boolean) {
        return function (target: any, propertyKey: string) {

            if (target.__validationRules == null) {
                target.__validationRules = new Array<ValidationRule>();
            }
            let validationRule = new ValidationRule();
            validationRule.className = target.constructor.name;
            validationRule.displayName = displayName;
            validationRule.propertyName = propertyKey;
            validationRule.minValue = minValue;
            validationRule.maxValue = maxValue;
            validationRule.regularExpression = regularExpression;
            validationRule.validationType = 'validString';


            target.__validationRules.push(validationRule);
        }
    }

    public required(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_REQUIRED_NAME;

            validationRule.validationFunc = (data) => {
                return data !== undefined && data !== null && data.toString().trim() !== '';
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate Interger number
     * @param errorMessage The error message
     */
    public integer(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_INTEGER_NAME;
            validationRule.validationFunc = (data) => {
                let num: number;
                try {
                    if (!data) {
                        if (isNaN(data)) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        num = parseFloat(data + '');
                        return data ? num % 1 === 0 : true;
                    }
                } catch (ex) {
                    return false;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
     * Validate Float number
     * @param errorMessage The error message
     */
    public float(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_FLOAT_NAME;
            validationRule.validationFunc = (data) => {
                if (!data) {
                    if (isNaN(data)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    let num: number;
                    try {
                        num = parseFloat(data + '');
                        return !isNaN(num);
                    } catch (ex) {
                        return false;
                    }
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
     * Validate email format
     * @param errorMessage The error message
     */
    public email(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_EMAIL_NAME;
            validationRule.validationFunc = (data) => {
                return (data !== undefined && data !== null && data !== '') ? this.REG_EX_EMAIL.test(data.trim()) : true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }

     /**
     * Validate mobile format
     * @param errorMessage The error message
     */
    public mobile(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MOBILE_NAME;
            validationRule.validationFunc = (data) => {
                return (data !== undefined && data !== null && data !== '') ? this.VALIDATION_TYPE_NUMBER.test(data) : true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
     * Validate min equal with value min
     * @param errorMessage
     * @param min
     */
    public minEqual(errorMessage: string, min: number = 0) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_NAME;// 'min';
            validationRule.validationValue = min;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                if (data || data === 0) {
                    return data >= min;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate min number
     * @param errorMessage The error message
     * @param min The min number
     */
    public min(errorMessage: string, min: number = 0) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_NAME;// 'min';
            validationRule.validationValue = min;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                if (data || data === 0) {
                    return data > min;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate min date
     * @param errorMessage The error message
     * @param minDate The min date
     */
    public minDate(errorMessage: string, minDate: Date = null) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_DATE;// 'minDate';
            validationRule.validationValue = minDate ? minDate : Date.now();
            validationRule.errorMessage = validationRule.errorMessage;
            validationRule.validationFunc = (data) => {
                if (data !== undefined && data !== null) {
                    let dateSource = new Date(data.getTime());
                    dateSource.setHours(0, 0, 1);
                    let dateDestination = new Date(validationRule.validationValue.getTime());
                    dateDestination.setHours(0, 0, 1);
                    return dateSource.toISOString().substr(0, 10) >= dateDestination.toISOString().substr(0, 10);
                } else {
                    return false;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
     * Validate min current time that input by date time
     * @param errorMessage The error message
     */
    public minCurrentTime(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_CURRENT_TIME;
            validationRule.validationValue = Date.now();
            validationRule.errorMessage = validationRule.errorMessage;
            validationRule.validationFunc = (data) => {
                if (data !== undefined && data !== null) {
                    let dateSource: Date = new Date(data);
                    let currentDate: Date = new Date();
                    return dateSource >= currentDate;
                } else {
                    return false;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * validate current date time that input by minutes
     * @param errorMessage
     */
    public minCurrentMinutes(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_CURRENT_MINUTES;
            validationRule.validationValue = Date.now();
            validationRule.errorMessage = validationRule.errorMessage;
            validationRule.validationFunc = (data) => {
                return data !== undefined && data !== null ? data >= 0 && data <= 1440 : true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate min length of string
     * @param errorMessage The error message
     * @param minLength The min length number
     */
    public minLength(errorMessage: string, minLength: number = 0) {

        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_LENGTH_NAME;// 'minLength';
            validationRule.validationValue = minLength;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                return (data !== undefined && data !== null && data !== '' && data.length > 0) ? data.length >= minLength : true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate min length of array
     * @param errorMessage The error message
     * @param minLength The min length of array
     */
    public minArrayLength(errorMessage: string, minLength: number = 0) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_ARRAY_LENGTH_NAME;// 'minArrayLength';
            validationRule.validationValue = minLength;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                return data !== undefined && data !== null && data !== '' && data.length >= minLength;
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate max number
     * @param errorMessage The error message
     * @param max The max number
     */
    public max(errorMessage: string, max: number = 100) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MAX_NAME;
            validationRule.validationValue = max;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                if (data) {
                    return data < max;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate max number
     * @param errorMessage The error message
     * @param max The max number
     */
    public maxOrEqual(errorMessage: string, max: number = 100) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MAX_OR_EQUAL_NAME;
            validationRule.validationValue = max;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                if (data) {
                    return data <= max;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate max length of string
     * @param errorMessage The error message
     * @param maxLength The max length number
     */
    public maxLength(errorMessage: string, maxLength: number = 100) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MAX_LENGTH_NAME;// 'maxLength';
            validationRule.validationValue = maxLength;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                return (data !== undefined && data !== null && data !== '' && data.length > 0) ? data.length <= maxLength : true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate max length of array
     * @param errorMessage The error message
     * @param maxLength The max length of array
     */
    public maxArrayLength(errorMessage: string, maxLength: number = 100) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MAX_ARRAY_LENGTH_NAME;// 'maxArrayLength';
            validationRule.validationValue = maxLength;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                return data !== undefined && data !== null && data !== '' && data.length <= maxLength;
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
     * Validate greater than
     * @param errorMessage The error message
     * @param fieldName The original field name of model
     * @param otherFieldName The destination field name of model
     */
    public greaterThan(errorMessage: string, fieldName: string, otherFieldName: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, Constants.VALIDATORDECORATOR.VALIDATOR_GREATER_THAN_NAME + '_' + fieldName + '_' + otherFieldName, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_GREATER_THAN_NAME + '_' + fieldName + '_' + otherFieldName;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let myValue = obj[fieldName];
                let otherValue = obj[otherFieldName];
                if (otherValue) {
                    if (myValue instanceof Date) {
                        return (myValue.getTime() - otherValue.getTime()) > 1000; // Only 1 second
                    } else {
                        return myValue !== undefined && myValue !== null && myValue > otherValue;
                    }
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
     * Validate less than
     * @param errorMessage The error message
     * @param fieldName The original field name of model
     * @param otherFieldName The destination field name of model
     */
    public lessThan(errorMessage: string, fieldName: string, otherFieldName: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, Constants.VALIDATORDECORATOR.VALIDATOR_LESS_THAN_NAME + '_' + fieldName + '_' + otherFieldName, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_LESS_THAN_NAME + '_' + fieldName + '_' + otherFieldName;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {

                if (!obj) return true;
                let myValue = obj[fieldName];
                let otherValue = obj[otherFieldName];
                if (otherValue) {
                    if (myValue instanceof Date) {
                        return (otherValue.getTime() - myValue.getTime()) > 1000; // Only 1 second
                    } else {
                        return myValue !== undefined && myValue !== null && myValue < otherValue;
                    }
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
     * Validate compare object is equal
     * @param errorMessage The error message
     * @param fieldName The original field name of model
     * @param otherFieldName The destination field name of model
     */
    public compareString(errorMessage: string, fieldName: string, otherFieldName: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target,
                Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName,
                errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let currentValue = obj[fieldName];
                let otherValue = obj[otherFieldName];
                if (currentValue && otherValue) {
                    return currentValue === otherValue;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * validate other value will be depends current value
     * @param errorMessage
     * @param fieldName
     * @param otherFieldName
     * @param num
     */
    //TODO: REFACTOR - CONTAINS REFERENCE TO BOOKBOOK CONSTANT.
    /*public minDepends(errorMessage: string, fieldName: string, otherFieldName: string, num: number = 0) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let message = util.format(errorMessage, num),
                validationRule = ValidationHelper.initValidationRule(target,
                    Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName,
                    message);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationValue = num;
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let currentValue = obj[fieldName],
                    otherValue = obj[otherFieldName];
                return (currentValue === PickdyConstants.DEPOSIT_RULES.KEY.DOLLAR_AMOUNT && otherValue > 0) || currentValue !== PickdyConstants.DEPOSIT_RULES.KEY.DOLLAR_AMOUNT;
            }
            target.__validationRules.unshift(validationRule);
        }
    }*/
    /**
     * compare 2 object to validate required
     * @param errorMessage
     * @param fieldName
     * @param otherFieldName
     */
    public compareValues(errorMessage: string, fieldName: string, otherFieldName: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target,
                Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName,
                errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let currentValue = obj[fieldName];
                let otherValue = obj[otherFieldName];
                return (currentValue && !otherValue) || (otherValue && !currentValue) || (!isNaN(parseFloat(otherValue + '')));
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Validate compare object is not equal
     * @param errorMessage The error message
     * @param fieldName The original field name of model
     * @param otherFieldName The destination field name of model
     */
    public compareNotSameString(errorMessage: string, fieldName: string, otherFieldName: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target,
                Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_NOT_SAME_STRING + '_' + fieldName + '_' + otherFieldName,
                errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_NOT_SAME_STRING + '_' + fieldName + '_' + otherFieldName;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let currentValue = obj[fieldName];
                let otherValue = obj[otherFieldName];
                if (currentValue && otherValue) {
                    return currentValue !== otherValue;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Create validation rule list
     * @param target the target object
     */
    public static initValidationRules(target: any) {
        if (target.__validationRules === undefined || target.__validationRules === null) {
            target.__validationRules = new Array<ValidationRule>();
        }
    }

    /**
     * Create validation rule
     * @param target target object
     * @param propertyKey Property key of model
     * @param errorMessage the error message
     */
    public static initValidationRule(target: any, propertyKey: string, errorMessage: string): ValidationRule {
        let validationRule = new ValidationRule();
        validationRule.className = target.constructor.name;
        validationRule.errorMessage = errorMessage;
        validationRule.propertyName = propertyKey;
        validationRule.validateScope = ValidationScope.Field;
        return validationRule;
    }

    /**
    * Validate phone number
    * @param errorMessage The error message
    */
    public phone(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_PHONE_NAME;// 'phone';
            validationRule.validationFunc = (data) => {
                if (data !== undefined && data !== null && data !== '') {
                    let phoneNumber = data.trim();
                    while (phoneNumber.indexOf(" ") >= 0) { phoneNumber = phoneNumber.replace(" ", "") }
                    return data !== undefined && data !== null && data !== '' && this.REG_EX_PHONE.test(phoneNumber);
                }
                return true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
    * Ingonre validation on server
    */
    public ignoreValidateOnServer() {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, '');
            validationRule.validationType = Constants.VALIDATORDECORATOR.IGNORE_VALIDATION;
            validationRule.validationFunc = (data) => {
                return true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
    * Validate meal period have select at lest one day of week
    * @param errorMessage The error message
    */
    //TODO: REFACTOR- CONTAINS BOOKBOOK REFERENCE.
    /*public requiredAtLeastOneDayOfWeek(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target,
                Constants.VALIDATORDECORATOR.REQUIRED_AT_LEAST_ONE_DAY_OF_WEEK,
                errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.REQUIRED_AT_LEAST_ONE_DAY_OF_WEEK;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                let period: IPeriod = <IPeriod>obj;
                let check: boolean = period.sundayAvailable
                    || period.mondayAvailable
                    || period.tuesdayAvailable
                    || period.wednesdayAvailable
                    || period.thursdayAvailable
                    || period.fridayAvailable
                    || period.saturdayAvailable;
                return check;
            }
            target.__validationRules.unshift(validationRule);
        }
    }*/
    /* TODO REFACTOR- CONTAINS BOOKBOOK REFERENCE
    private checkPeriodInSameDayOfWeek(period1: IPeriod, period2: IPeriod, weekDay: number) {
        switch (weekDay) {
            case Constants.DAY_OF_WEEK.SUNDAY:
                return period1.sundayAvailable && period1.sundayAvailable === period2.sundayAvailable;
            case Constants.DAY_OF_WEEK.MONDAY:
                return period1.mondayAvailable && period1.mondayAvailable === period2.mondayAvailable;
            case Constants.DAY_OF_WEEK.TUESDAY:
                return period1.tuesdayAvailable && period1.tuesdayAvailable === period2.tuesdayAvailable;
            case Constants.DAY_OF_WEEK.WEDNESDAY:
                return period1.wednesdayAvailable && period1.wednesdayAvailable === period2.wednesdayAvailable;
            case Constants.DAY_OF_WEEK.THURSDAY:
                return period1.thursdayAvailable && period1.thursdayAvailable === period2.thursdayAvailable;
            case Constants.DAY_OF_WEEK.FRIDAY:
                return period1.fridayAvailable && period1.fridayAvailable === period2.fridayAvailable;
            case Constants.DAY_OF_WEEK.SATURDAY:
                return period1.saturdayAvailable && period1.saturdayAvailable === period2.saturdayAvailable;
        }
        return false;
    }*/
    private dateRangeOverlaps(aStart, aEnd, bStart, bEnd) {
        // time range can be equal
        if (aStart <= bStart && bStart <= aEnd) {
            return true; // b starts in a
        }
        if (aStart < bEnd && bEnd < aEnd) {
            return true; // b ends in a
        }
        if (bStart < aStart && aEnd < bEnd) {
            return true; // a in b
        }
        return false;
    }
    /* TODO REFACTOR - CONTAINS BOOKBOOK CODE
    public checkIsOverlapTime(periods: IPeriod[]): boolean {
        let checkMealPeriodList: IPeriod[] = [];
        let oneMinute = 60 * 1000;
        if (periods.length > 1) {
            for (let k = 0; k <= Constants.VALIDATORDECORATOR.DAY_IN_WEEK; k++) {
                for (let i = 0; i < periods.length - 1; i++) {
                    checkMealPeriodList = [];
                    for (let j = 0; j < periods.length; j++) {
                        if (i !== j && this.checkPeriodInSameDayOfWeek(periods[i], periods[j], k)) {
                            checkMealPeriodList.push(periods[j]);
                        }
                    }
                    if (checkMealPeriodList.length > 0) {
                        for (let j = 0; j < checkMealPeriodList.length; j++) {
                            let check1 = this.dateRangeOverlaps(
                                Math.floor(periods[i].startTime.getTime() / oneMinute),
                                Math.floor(periods[i].endTime.getTime() / oneMinute),
                                Math.floor(checkMealPeriodList[j].startTime.getTime() / oneMinute),
                                Math.floor(checkMealPeriodList[j].endTime.getTime() / oneMinute))
                            let check2 = this.dateRangeOverlaps(
                                Math.floor(checkMealPeriodList[j].startTime.getTime() / oneMinute),
                                Math.floor(checkMealPeriodList[j].endTime.getTime() / oneMinute),
                                Math.floor(periods[i].startTime.getTime() / oneMinute),
                                Math.floor(periods[i].endTime.getTime() / oneMinute))
                            if (check1 && check2) return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    */

    /**
    * Validate overlap time of meal period
    * @param errorMessage The error message
    */
    /* TODO REFACTOR - CONTAINS BOOKBOOK CODE
    public overlapTime(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target,
                Constants.VALIDATORDECORATOR.PERIOD_OVERLAP_TIME + '_' + propertyKey,
                errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.PERIOD_OVERLAP_TIME + '_' + propertyKey;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                let periods: IPeriod[] = obj[propertyKey];
                if (periods && periods.length > 0) {
                    let checkPeriodList = periods.filter(item => !item.validTo);
                    let check = !this.checkIsOverlapTime(checkPeriodList);
                    return check;
                } else return true;

            }
            target.__validationRules.unshift(validationRule);
        }
    }
    */

    /**
    * Validate duplicate name of meal period
    * @param errorMessage The error message
    */
    /* TODO REFACTOR - CONTAINS BOOKBOOK CODE
    public duplicateName(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target,
                Constants.VALIDATORDECORATOR.VALIDATOR_DUPLICATE_MEAL_PERIODS_NAME + '_' + propertyKey,
                errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_DUPLICATE_MEAL_PERIODS_NAME + '_' + propertyKey;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                let periods: IPeriod[] = obj[propertyKey];
                return !this.checkDuplicatePeriodName(periods);

            }
            target.__validationRules.unshift(validationRule);
        }
    }
    */

    /**
     * Check duplicate name of the list  period
     * @param periods Period List
     */
    /* TODO REFACTOR - CONTAINS BOOKBOOK CODE
    public checkDuplicatePeriodName(periods: IPeriod[]): boolean {
        if (periods && periods.length > 0) {
            let track = {};
            let duplicates = [];
            periods.forEach((item: IPeriod) => {
                if (!item.validTo && item.name) {
                    if (!track[item.name.trim().toLocaleLowerCase() + '']) {
                        track[item.name.trim().toLocaleLowerCase() + ''] = true;
                    } else duplicates.push(item.name.toLocaleLowerCase());
                }
            });
            return duplicates.length > 0;
        }
        return false;
    }
    */

    /**
    * Validate max length of meal periods
    * @param errorMessage The error message
    * @param maxLength The length of list meal period
    */
    /* TODO REFACTOR - CONTAINS BOOKBOOK CODE
    public maxMealPeriodLength(errorMessage: string, maxLength: number = 100) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MAX_MEAL_PERIODS_NAME;// 'maxMealPeriods';
            validationRule.validationValue = maxLength;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (periods: IPeriod[], obj) => {
                if (periods && periods.length > 0) {
                    let periodList = periods.filter(item => !item.validTo);
                    return periodList.length <= maxLength;
                } else return true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    */

    /**
    * Validate the number
    * @param errorMessage The error message
    */
    public numeric(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_NUMERIC_VALUE;
            validationRule.validationFunc = (data) => {
                return data === undefined || data === null || data === '' || this.VALIDATION_TYPE_NUMBER.test(data);
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
    * Validate the date
    * @param date The date
    */
    public isValidDate(date: string) {
        return date && this.REG_EX_DATE.test(date);
    }

    /**
    * Validate the time
    * @param time The time
    */
    public isValidTime(time: string) {
        return time && this.REG_EX_TIME.test(time);
    }

    /**
    * Validate the time from and time to
    * @param timeFrom The time from
    * @param timeTo The time to
    */
    public isValidTimeFromAndTimeTo(timeFrom: string, timeTo: string) {
        return timeFrom && this.REG_EX_TIME.test(timeFrom) && this.REG_EX_TIME.test(timeTo) && timeFrom <= timeTo;
    }
    /**
     * validate less than number with another the field
     * @param errorMessage
     * @param fieldName
     * @param otherFieldName
     */
    public lessThanNumber(errorMessage: string, fieldName: string, otherFieldName: string, isRequireValue: boolean = false) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target,
                Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName,
                errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_COMPARE_STRING + '_' + fieldName + '_' + otherFieldName;
            validationRule.validateScope = ValidationScope.Class;
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let currentValue = obj[fieldName],
                    otherValue = obj[otherFieldName];
                if ((isRequireValue && !otherValue && currentValue) || (isRequireValue && otherValue && !currentValue)) {
                    return !isRequireValue;
                } else return currentValue && otherValue && +otherValue > 0 && +currentValue > 0 ? +currentValue <= +otherValue : true;

            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Vaildate min/ max number
     * @param errorMessage the error message
     * @param max the max number
     */
    public minMax(errorMessage: string, max: number = 0) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_MAX_NAME;// 'minMax';
            validationRule.validationValue = max;
            validationRule.errorMessage = util.format(validationRule.errorMessage, validationRule.validationValue);
            validationRule.validationFunc = (data) => {
                return (data) ? data > 0 && data <= max : true;
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Vaildate min less or equal max number
     * @param errorMessage the error message
     * @param max the max number
     */
    public minLessEqualMax(errorMessage: string, max: string = '') {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_LESS_EQUAL_MAX_NAME;// 'minLessEqualMax';
            validationRule.validationValue = max;
            validationRule.errorMessage = util.format(validationRule.errorMessage);
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let maxValue = obj[max];
                if ((maxValue) && +maxValue > 0) {
                    return (data) ? data > 0 && data <= +maxValue : true;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    /**
     * Vaildate max greater or equal min number
     * @param errorMessage the error message
     * @param min the max number
     */
    public maxGreaterEqualMin(errorMessage: string, min: string = '') {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MAX_GREATER_EQUAL_MIN_NAME;// 'maxGreaterEqualMin';
            validationRule.validationValue = min;
            validationRule.errorMessage = util.format(validationRule.errorMessage);
            validationRule.validationFunc = (data, obj) => {
                if (!obj) return true;
                let minValue = obj[min];
                if ((minValue) && +minValue > 0) {
                    return (data) ? data > 0 && data >= +minValue : true;
                } else {
                    return true;
                }
            }
            target.__validationRules.unshift(validationRule);
        }
    }

    /**
    * Validate table number of booking
    * @param errorMessage the error message
    */
    /* TODO REFACTOR - CONTAINS BOOKBOOK CODE
    public tableNumberOfBooking(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_FORMAT_TABLE_NUMBER_OF_BOOKING;

            validationRule.errorMessage = util.format(validationRule.errorMessage);
            validationRule.validationFunc = (data, obj) => {
                return this.validateFormatTableNumber(data ? data : '');
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    */

    /**
     * Validate format number of booking table
     * @param tableStr
     */
    private validateFormatTableNumber(tableStr: string): boolean {
        if (tableStr) {
            if (tableStr === '') {
                return true;
            } else {
                let tableStrTemp: string = tableStr + '';
                return this.REX_FORMAT_TABLE_NUMBER.test(tableStrTemp);
            }

        } else {
            // Don't have table number
            return true;
        }
    }

    /**
     * Validate min table number of booking
     * @param errorMessage the error message
     */
    /* TODO REFACTOR - CONTAINS BOOKBOOK CODE
    public minTableNumberOfBooking(errorMessage: string) {
        return (target: any, propertyKey: string) => {
            ValidationHelper.initValidationRules(target);
            let validationRule = ValidationHelper.initValidationRule(target, propertyKey, errorMessage);
            validationRule.validationType = Constants.VALIDATORDECORATOR.VALIDATOR_MIN_TABLE_NUMBER_OF_BOOKING;
            validationRule.errorMessage = util.format(validationRule.errorMessage);
            validationRule.validationFunc = (data, obj) => {
                return this.validateMinTableNumber(data ? data : (data === 0 ? '0' : ''));
            }
            target.__validationRules.unshift(validationRule);
        }
    }
    */

    /**
     * Validate minimun number of booking table
     * @param tableStr
     */
    private validateMinTableNumber(tableStr: string): boolean {
        if (tableStr) {
            if (tableStr === '') {
                return true;
            } else {
                let tableStrTemp: string = tableStr + '';
                while (tableStrTemp.indexOf(',') >= 0) {
                    tableStrTemp = tableStrTemp.replace(',', '/');
                }
                if (tableStrTemp[tableStrTemp.length - 1] === '/') {
                    tableStrTemp = tableStrTemp.substr(0, tableStrTemp.length - 1);
                }
                let tableNumbers: Array<string> = tableStrTemp.split('/')
                for (let i = 0; i < tableNumbers.length; i++) {
                    if (!this.REX_TABLE_NUMBER.test(tableNumbers[i])) {
                        return false;
                    }
                }
                return true;
            }

        } else {
            // Don't have table number
            return true;
        }
    }
}



var ValidationDecorator = new ValidationHelper();
export default ValidationDecorator;