import express = require('express');
import IPersisnance from "../../fwg.pickdy.common/base/interfaces/IPersistance";
import IAppAttachments from "../../fwg.pickdy.common/base/interfaces/IAppAttachments";
import Constants from '../../fwg.pickdy.common/base/Constants';
import ClassInfo from '../../fwg.pickdy.common/base/ClassInfo';
import MongoHelper from '../../fwg.pickdy.common/utilities/helpers/MongoHelper';
import RestHelper from '../../fwg.pickdy.common/utilities/helpers/RestHelper';
import BaseObj from '../../fwg.pickdy.common/base/BaseObj';
import AppConfig from "../../fwg.pickdy.common/utilities/AppConfig";
import BaseHelper from "../../fwg.pickdy.common/base/BaseHelper";
// import UserManagerAttachments from './UserManagerAttachments';
import ICache from "../../fwg.pickdy.common/base/interfaces/ICache";
import User from '../../fwg.pickdy.common/model/User';
// import RedisHelper from '../../fwg.pickdy.pos.common/utilities/helpers/RedisHelper';
var app = express();
declare var Promise: any;

/*
ADD ANY FUCTIONALY SPECIFIC TO THE API HERE.
FUNCTIONALITY CAN BE ADDED TO ANY HELPER/MANAGER CLASS AS MANAGER CLASSES ARE SINGLETONS.
THIS CLASS IS CALLED WHEN THE API IS STARTED.

THE IDEA, BUT NOT TESTED IS THAT A FUNCTION CAN BE ASSIGNED TO A HELPER CLASSES METHODS, SUCH AS ON BEFORE SAVE...

*/
class AppAttachmentHelper implements IAppAttachments {
    public getPersistance<T extends BaseObj>(classInfo: ClassInfo, user: User): IPersisnance {
       if (classInfo.nameSpace == undefined || classInfo.nameSpace == null)
            throw Error("Your classinfo has no name space. It is required." + classInfo.type);

        let defaultNameSpace = AppConfig.GetConfiguration(AppConfig.DEFAULT_NAMESPACE);
        if (classInfo.nameSpace == defaultNameSpace) {
           if (classInfo.dbType == Constants.PERSISTANCE_MONGO
                || AppConfig.GetConfiguration(AppConfig.PERSISTANCE_DEFAULT) == Constants.PERSISTANCE_MONGO) {
                return new MongoHelper<T>(user);
            }
            else {
                return new RestHelper<T>(user);
            }

        }
        else {
            return new RestHelper<T>(user);
        }
    }

    public getCache<T extends BaseObj>(classInfo: ClassInfo, user: User): ICache {
        if(classInfo.nameSpace == undefined || classInfo.nameSpace == null)
        throw Error("Your classinfo has no name space. It is required." + classInfo.type);

        let defaultNameSpace = AppConfig.GetConfiguration(AppConfig.DEFAULT_NAMESPACE);

        if (classInfo.cacheType == Constants.CACHE_REDIS && classInfo.nameSpace == defaultNameSpace) {
            // return new RedisHelper<T>(user);
            return(null);
        }else{
            return(null);
            //throw Error("No cache has been configured.");
        }
    }

    public getAppDispatcher(){
        return null;
    }

    public SetAttachmentMethod<T extends BaseObj>(helper: BaseHelper<T>) {
        switch (helper.constructor['name']) {
            case "UserManager":
                // UserManagerAttachments.SetMethods(helper);
                break;
            default:
                break;
        }
    }
}

var AppAttachments = new AppAttachmentHelper();
export default AppAttachments;





