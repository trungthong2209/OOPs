import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';

export default class DataAccessPermission extends BaseEntity<DataAccessPermission> implements ICachable{

    public name: string;

    constructor() {
        super();
    }

    public assign(obj: any) {
        if (obj == null)
            return;
        
        this._id = obj._id;
        this.name = obj.name;
    }

}