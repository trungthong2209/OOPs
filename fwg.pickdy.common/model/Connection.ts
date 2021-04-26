import BaseEntity from '../base/BaseEntity';
import Crypt from '../utilities/security/CryptLib';

export default class Connection extends BaseEntity<Connection> {

    public username: string;
    public database: string;
    public host: string;
    // private readonly USER_PASSWORD = '[[USER_PASSWORD]]';

    public password: string;

    public connectionString: string;


    constructor() {
        super();
    }

    public assign(obj: any) {
        if (obj == null) return;
        let option = this.stringToObject(obj.connectionString);

        this._id = obj._id;
        this.connectionString = obj.connectionString;
        this.username = obj.username;
        this.password = obj.password;
        this.database = option.database;
        this.host = option.server;
    }
    private getHostInfor(str: string) {
        return str.substr(7, str.length - 1);
    }
    public getPassword() {
        return Crypt.decrypt(this.password);
    }
    private stringToObject(str): any {
        let properties = str? str.replace(' ', '').split(';') : [];
        // let reg = /\=+([^;]+)/g;
        // let rsls = str.match(reg);
        let obj = {};
        properties.forEach(function (property: string) {
            property = property.replace(' ', '');
            let equalIndex = property.indexOf('=');
            let propName = property.substring(0, equalIndex).toLowerCase();
            let propValue = property.substring(equalIndex + 1, property.length);

            obj[propName] = propValue;
        });
        return obj;
    }
}
