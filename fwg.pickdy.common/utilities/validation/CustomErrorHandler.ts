import ErrorHandler from '../../utilities/validation/ErrorHandler';
import HttpStatus from '../..//base/HttpStatus';
export default class CustomErrorHandler extends ErrorHandler {
    constructor(message?: Array<string>, statusCode: number = HttpStatus.BAD_REQUEST, name: string = "") {
        super(message, statusCode, name);
    }
}
