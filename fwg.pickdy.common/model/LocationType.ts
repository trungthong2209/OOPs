import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';
export default class LocationType extends BaseEntity<LocationType> implements ICachable{

    public name: string;
    public cacheOn:boolean = true;
    
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