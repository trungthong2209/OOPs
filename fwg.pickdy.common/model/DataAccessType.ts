import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';
import Role from './Role';
import Location from './Location';

export default class DataAccessType extends BaseEntity<DataAccessType> implements ICachable{

    public name: string;
    public applicationId: string;
    
    constructor() {
        super();
    }

    public assign(obj: any) {
        
        this._id = obj._id;
        this.name = obj.name;
        this.applicationId = obj.applicationId;
    }

}