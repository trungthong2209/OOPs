import Promise = require('promise');
import BaseHelper from "../../../fwg.pickdy.common/base/BaseHelper";
import Constants from "../../../fwg.pickdy.common/base/Constants";
import User from "../../../fwg.pickdy.common/model/User";
import TemplateUnits from '../TemplateUnits';
export default class TemplateUnitsManager extends BaseHelper<TemplateUnits> {
    constructor(user: User) {
        super(user);
        this.classInfo.mongoCollectionName = 'templateUnits';
        this.classInfo.endPoint = "templateUnits"
        this.classInfo.type = TemplateUnits;
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.nameSpace = "fwg.pickdy.common";   

    }

    public createObject(data): Promise<TemplateUnitsManager> {
        let promise = new Promise<TemplateUnitsManager>((resolve, reject) => {
            let obj = new TemplateUnits();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: TemplateUnits, data: any) {
        obj._id = data._id;
        obj.name = data.name;
        obj.businessModelId = data.businessModelId;
    }
    public newInstance() {
        return new TemplateUnits();
    }

}

