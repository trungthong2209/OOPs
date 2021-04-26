import BaseEntity from '../base/BaseEntity';
import Role from './Role';
import Location from './Location';
import "reflect-metadata";
import ClassInfo from '../base/ClassInfo';
import Constants from '../base/Constants';
import IgnoreDecorator from '../utilities/ignore-helper/IgnoreDecorator';

export default class Access extends BaseEntity<Access>{
	public roleId : string;
    public locationId :string;
	@IgnoreDecorator.ignoreInDb()
    public role: Role;
	@IgnoreDecorator.ignoreInDb()
    public location: Location;
    constructor() {
        super();
        this.role = new Role();
        this.location = new Location();
    }
    public assign(obj: any) {
        if (obj == null)
            return;
		if (obj.role != null){
			this.roleId = obj.role._id ? obj.role._id : obj.roleId;
        	this.role.assign(obj.role);
		}
		if(obj.location != null){
	        this.locationId = obj.location._id ? obj.location._id : obj.locationId;
			this.location.assign(obj.location);
		}
    }
};
