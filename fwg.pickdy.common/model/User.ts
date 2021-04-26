import "reflect-metadata";

import BaseEntity from '../base/BaseEntity';
import ICachable from '../base/interfaces/ICachable';
import ClassInfo from '../base/ClassInfo';
import Constants from '../base/Constants';
import Access from './Access';
import Location from './Location';
import Role from './Role';
import DataAccess from './DataAccess';

import ValidationDecorator from '../utilities/validation/ValidationDecorator';
import IgnoreDecorator from '../utilities/ignore-helper/IgnoreDecorator';

export default class User extends BaseEntity<User> implements ICachable{
	public auth0UserId: string = null;

    // @ValidationDecorator.validString("Name", 1, null, null)
    public name: string;
    @ValidationDecorator.required(Constants.USER.FIRSTNAME_REQUIRE)
    @ValidationDecorator.maxLength(Constants.USER.FIRSTNAME_MAXLENGTH, Constants.USER.FIRSTNAME_MAXLENGTH_VALUE)
    public firstName: string = null;
    @ValidationDecorator.required(Constants.USER.LASTNAME_REQUIRE)
    @ValidationDecorator.maxLength(Constants.USER.LASTNAME_MAXLENGTH, Constants.USER.LASTNAME_MAXLENGTH_VALUE)
	public lastName: string = null;
    @ValidationDecorator.required(Constants.USER.EMAIL_REQUIRE)
    @ValidationDecorator.email(Constants.USER.EMAIL_INCORRECT)
    @ValidationDecorator.maxLength(Constants.USER.EMAIL_MAXLENGTH, Constants.USER.EMAIL_MAXLENGTH_VALUE)
    public email: string = null;  
    @IgnoreDecorator.ignoreInDb()
    public password: string = null;
    @IgnoreDecorator.ignoreInDb()
    @ValidationDecorator.compareString(Constants.USER.CONFIRMPASSWORD_COMPARE, 'password', 'confirmPassword')
    public confirmPassword: string = null;
    @IgnoreDecorator.ignoreInDb()
    public newPassword: string = null;
    @IgnoreDecorator.ignoreInDb()
    @ValidationDecorator.compareString(Constants.USER.CONFIRMPASSWORD_COMPARE, 'newPassword', 'confirmNewPassword')
    public confirmNewPassword: string = null;
    @ValidationDecorator.required(Constants.USER.MOBILE_REQUIRE)
    @ValidationDecorator.mobile(Constants.USER.MOBILE_INCORRECT)
    @ValidationDecorator.maxLength(Constants.USER.MOBILE_MAXLENGTH, Constants.USER.MOBILE_MAXLENGTH_VALUE)
    @ValidationDecorator.minLength(Constants.USER.MOBILE_MINLENGTH, Constants.USER.MOBILE_MINLENGTH_VALUE)
    public mobile: string = null;    
    public token: string = null;
    public notificationTokens: Array<string> = null;
    public access: Array<Access>;
    public locationId: string;
    constructor() {
        super();
        this.access = new Array<Access>();
        this.notificationTokens = new Array<string>();
    }

    public assign(obj: any) {
        if (obj == null)
            return;

        this._id = obj._id;
        this.name = obj.name;
        this.email = obj.email;
       	this.token = obj.token;
		this.firstName = obj.firstName;
        this.lastName = obj.lastName;    
        this.auth0UserId = obj.auth0UserId;
        this.locationId = obj.locationId;
        this.mobile = obj.mobile;
        this.password = obj.password;
        this.newPassword = obj.newPassword;
        this.confirmNewPassword = obj.confirmNewPassword;
        for (let i = 0; i < this.arrayLength(obj.access); i++) {
            let a = new Access();
            a.assign(obj.access[i]);
            this.access.push(a);
        }
        this.notificationTokens = obj.notificationTokens;
    }


    public hasDataAccesCodes(dataAccessCodes: string): boolean {
        return this.hasDataAccesCodesPermission(dataAccessCodes, null);
    }

    public hasDataAccesCodesPermission(dataAccessCodes: string, permission: string): boolean {
        return this.hasDataAccesCodesPermissionLocation(dataAccessCodes, permission, null);
    }

    public hasDataAccesCodesPermissionLocation(dataAccessCodes: string, permission: string, location: Location): boolean {
        if(dataAccessCodes){
            let dataAccessCodesArray = dataAccessCodes.split(",");
            for (let dataAccessCode of dataAccessCodesArray) {
                if (this.hasDataAccesCode(dataAccessCode, permission, location)) {
                    return true;
                }
            }
        }
        return false;
    }

    private hasDataAccesCode(dataAccessCode: string, permission: string, location: Location): boolean {
        if(dataAccessCode == "" || dataAccessCode == null) {   //IF THE ACCESS CODE IS NOT SET THERE IS NOTHING TO DETECT.
            return true;
        }
        for (let i = 0; i < this.access.length; i++){
            let role = this.access[i].role;
            if(role.dataAccesses != null) {
                for (let j = 0; j < role.dataAccesses.length; j++) {
                    if (role.dataAccesses[j].name == dataAccessCode) {
                        //if a location has been specified check the role is in the same location.
                        if (location != null) {
                            if (this.access[i].location._id == location._id)
                                if (this.hasPermission(role.dataAccesses[j], permission)) {
                                    return true;
                                }
                        }
                        if (location == null) {
                            if (this.hasPermission(role.dataAccesses[j], permission)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    /*
    If a permission has been specified check that the data access has the approperate permission.
    */
    private hasPermission(dataAccess: DataAccess, permission: string) {
        if (permission == null)
            return true;

        for (let i = 0; i < dataAccess.dataAccessPermissions.length; i++) {
            if (dataAccess.dataAccessPermissions[i].name == permission)
                return true;
        }
        return false;
    }

    public static newInstance(){
        return new User();
    }
    public getCurrentLocation(locationId?): Location {
        let locId = locationId || this.locationId,
            accesses = this.access || [];

        let locations = accesses.filter(x => x.location._id === locId);

        return locations && locations.length > 0 ? locations[0].location : null;
    } 
    public getUniqueIdentifiers(): any{
        let uniqueIdentifiers = super.getUniqueIdentifiers();
        uniqueIdentifiers["email"] = this.email;
        uniqueIdentifiers["auth0UserId"] = this.auth0UserId;
        return(uniqueIdentifiers);
    } 
}

