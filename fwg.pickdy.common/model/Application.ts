import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';
import Role from './Role';
export default class Application extends BaseEntity<Application> implements ICachable{

    public name: string;
    public url: string;
    public roles: Array<Role>;

    constructor() {
        super();
    }

    public assign(obj: any) {
        if (obj == null)
            return;

        this._id = obj._id;
        this.name = obj.name;       
        this.url = obj.url;
        for (let i = 0; i < this.arrayLength(obj.roles); i++) {
            let a = new Role();
            a.assign(obj.roles[i]);
            this.roles.push(a);
        }
    }

}