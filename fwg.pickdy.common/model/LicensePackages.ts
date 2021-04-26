import "reflect-metadata";

import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';


export default class LicensePackages extends BaseEntity<LicensePackages> implements ICachable{
	public applicationID: string = null;
    public licenseName: string;
    public price: number = 0 ;
    public months: number = 0;
    
    constructor() {
        super();
     
    }
    public assign(obj: any) {
        if (obj == null)
            return;
        this._id = obj._id;
        this.applicationID = obj.applicationID;
        this.licenseName = obj.licenseName;
       	this.price = obj.price;
		this.months = obj.months;
     
       
    }
   
}

