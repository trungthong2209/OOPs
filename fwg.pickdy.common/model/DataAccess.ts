import BaseEntity from '../base/BaseEntity';
import DataAccessPermission from './DataAccessPermission';
import Role from './Role';
import DataAccessType from './DataAccessType';
import IgnoreDecorator from '../utilities/ignore-helper/IgnoreDecorator';

export default class DataAccess extends BaseEntity<DataAccess> {

    public name: string;
    public roleId: string;
    public dataAccessTypeId: string;
    @IgnoreDecorator.ignoreInDb()
    public dataAccessType: DataAccessType;
    public dataAccessPermissionIds: Array<string>;
    @IgnoreDecorator.ignoreInDb()
    public dataAccessPermissions: Array<DataAccessPermission>;  
    constructor() {
        super();        
        this.dataAccessPermissions = new Array<DataAccessPermission>();
        this.dataAccessType = new DataAccessType();

    }

    public assign(obj: any) {
        if (obj == null)
            return;
        this._id = obj._id;
        this.name = obj.name;
        this.roleId = obj.roleId;
        this.dataAccessTypeId = obj.dataAccessTypeId;
        this.dataAccessPermissionIds = obj.dataAccessPermissionIds;
        this.dataAccessType.assign(obj.dataAccessType);
        for (let i = 0; i < this.arrayLength(obj.dataAccessPermissions); i++) {
            let a = new DataAccessPermission();
            a.assign(obj.dataAccessPermissions[i]);
            this.dataAccessPermissions.push(a);
        }
    }
}