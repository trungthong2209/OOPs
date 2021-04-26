import BaseEntity from '../base/BaseEntity';
import Connection from './Connection';

export default class Orginization extends BaseEntity<Orginization> {


    public name: string;
    public contactEmailAddress: string;
    public connection: Connection;

    constructor() {
        super();
        this.connection = new Connection();
    }


    public assign(obj: any) {
        if (obj == null)
            return;

        this._id = obj._id;
        this.name = obj.name;
        this.contactEmailAddress = obj.contactEmailAddress;

        this.connection.assign(obj.connection);
    }



}