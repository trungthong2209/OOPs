import "reflect-metadata";
import BaseEntity from '../base/BaseEntity';
import Guid from './Guid';

export enum EventType{
    DataUpdated = 1,
    DataInserted = 2,
    DataDeleted = 3
}

export default class Dispatcher extends BaseEntity<Dispatcher> {
  
    public id: string;
    public eventType: EventType;
    public nameSpace: string;
    public mongoCollectionName: string;
    public msgId: string;
    public connectionGuid: Guid;
    public criteia: any;


    public assign(obj: any){
        this._id = obj._id;
        this.id = obj.id;
        this.eventType = obj.eventType;
        this.nameSpace = obj.nameSpace;
        this.mongoCollectionName = obj.mongoCollectionName;
        this.msgId = obj.msgId;
        this.connectionGuid = obj.connectionGuid;
        if(obj.criteia)
            this.criteia = obj.criteia;
    }

    constructor() {
        super();
        this.criteia = null;
    }
}