export default class ErrorHandler extends Error {
    static BAD_REQUEST : number = 400;
    status : number;
    message : string; 
    constructor(message?:Array<string>, statusCode : number = ErrorHandler.BAD_REQUEST, name: string = "") {
        super(message.join('. ')); 
        this.message = message.length > 0? message[0]: '';
        this.name = name;
        this.status = statusCode; 
    } 
}