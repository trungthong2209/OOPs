import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';
import LocationType from './LocationType';
import Orginization from './Orginization';
import ValidationDecorator from '../utilities/validation/ValidationDecorator';
import IgnoreDecorator from '../utilities/ignore-helper/IgnoreDecorator';
import Constants  from '../base/Constants'

export default class Location extends BaseEntity<Location> implements ICachable{

    //todo rework with existing validation
    // @ValidationDecorator.validString('name', 1, Constants.LOCATIONS.NAME_MAXLENGTH, null)
    public name: string = null;
    public code: string = null;

    public locationTypeId: string = null;
    public ownerUserId: string = null;
    public parentLocationId: string = null;
	
	@IgnoreDecorator.ignoreInUI()
    public orginizationId: string = null;

    @IgnoreDecorator.ignoreInDb()
    public locationType: LocationType;

	@IgnoreDecorator.ignoreInDb()
    public orginization: Orginization;

    public cacheOn:boolean = true;

    constructor() {
        super();
        this.locationType = new LocationType();
        this.orginization = new Orginization();
    }

    public assign(obj: any) {
        if (obj == null)
            return;
        this._id = obj._id;
        this.name = obj.name;
        this.code = obj.code;
        this.locationTypeId = obj.locationTypeId;
        this.orginizationId = obj.orginizationId;
        this.ownerUserId = obj.ownerUserId;
        this.parentLocationId = obj.parentLocationId;
        this.locationType.assign(obj.locationType);
        this.orginization.assign(obj.orginization);
    }

}