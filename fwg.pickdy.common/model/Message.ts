import 'reflect-metadata';

import BaseEntity from '../base/BaseEntity';
import MessageTemplate from './MessageTemplate';
import ValidationDecorator from '../utilities/validation/ValidationDecorator';

export default class Message extends MessageTemplate  {

    public messageTo : string;  
    //@ValidationDecorator.validString("Name", 1, null, null)
    //TODO RENAME - this is the object that will be merged into the template. ie <<name>> => jason
    public properties: any;
    public messageCc: string;

    // these fields are set in AppConfigurationOptions.
    // @ValidationDecorator.validString("Name", 1, null, null)
    public messageFrom: string;
    // @ValidationDecorator.validString("Name", 1, null, null)
    public messageFromPassword: string;
    // @ValidationDecorator.validString("Name", 1, null, null)
    public host: string;
    // @ValidationDecorator.validString("Name", 1, null, null)
    public port: string;
    // @ValidationDecorator.validString("Name", 1, null, null)
    public encryption: string;
    // @ValidationDecorator.validString("Name", 1, null, null)
    public messageFromName: string;


    public assign(obj: any) {
        this._id = obj._id;
        this.code = obj.hasOwnProperty('code') ? obj.code : this.code;
        this.subject = obj.hasOwnProperty('subject') ? obj.subject : this.subject;
        this.body = obj.hasOwnProperty('body') ? obj.body : this.body;
        this.messageTo = obj.hasOwnProperty('messageTo') ? obj.messageTo : this.messageTo;
        this.messageCc = obj.hasOwnProperty('messageCc') ? obj.messageCc : this.messageCc;
        this.messageFrom = obj.hasOwnProperty('messageFrom') ? obj.messageFrom : this.messageFrom;
        this.messageFromPassword = obj.hasOwnProperty('messagePassword') ? obj.messagePassword
            : this.messageFromPassword;
        this.host = obj.hasOwnProperty('host') ? obj.host : this.host;
        this.port = obj.hasOwnProperty('port') ? obj.port : this.port;
        this.encryption = obj.hasOwnProperty('encryption') ? obj.encryption : this.encryption;
        this.messageFromName = obj.hasOwnProperty('messageName') ? obj.messageName : this.messageFromName;
        this.properties = obj.hasOwnProperty('properties') ? obj.properties : this.properties;
    }

    constructor() {
        super();
    }
}
