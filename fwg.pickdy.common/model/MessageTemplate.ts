import "reflect-metadata";

import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';
import ValidationDecorator from '../utilities/validation/ValidationDecorator';

export default class MessageTemplate extends BaseEntity<MessageTemplate> implements ICachable{
    //@ValidationDecorator.validString("Name", 1, null, null)
    public code : string;
    //@ValidationDecorator.validString("Name", 1, null, null)
    public subject : string;   
    //@ValidationDecorator.validString("Name", 1, null, null)
    public body : string;
   
    public assign(obj: any) {
        this._id = obj._id;
        this.code = obj.code;
        this.subject = obj.subject;
        this.body = obj.body;       
    }

    constructor() {
        super();
    }
}