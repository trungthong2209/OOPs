import BaseObj from '../../base/BaseObj';
import BaseHelper from '../../base/BaseHelper';
let Promise = require('promise');
import MongoQS = require('mongo-querystring');
import IPersisnance from '../../base/interfaces/IPersistance';
import MongoDB from './MongoDb';
import HttpStatus from '../../base/HttpStatus';
import ClassInfo from '../../base/ClassInfo';
import ErrorHandler from '../validation/ErrorHandler';
let EJSON = require('mongodb-extended-json');

export default class Mongo<T extends BaseObj> extends BaseObj implements IPersisnance {
    mongoClient: any;
    public objectID: any;
    protected user:any;
    constructor(user:any = null) {
        super();
        this.mongoClient = MongoDB.MongoClient;
        this.objectID = require('mongodb').ObjectID;
        this.user = user;
        MongoDB.MongoDB;
    }
    /**
     * TODO: When there is no object returned promise chain needs to continue. Loading of some objects is expected to be optional.
     * @param helper
     * @param data
     */
    private setSingle<T extends BaseObj>(helper: BaseHelper<T>, data): Promise<T> {
        if (data.length > 0) {
            data = (JSON.parse(JSON.stringify(data[0])) as T);
            return helper.createObject(data);
        }       
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    /**
     * TODO: When there is no object returned promise chain needs to continue. Loading of some objects is expected to be optional.
     * @param helper
     * @param data
     */
    private setCollection<T extends BaseObj>(helper: BaseHelper<T>, data): Promise<Array<T>> {
        if (data.length > 0) {
            data = (JSON.parse(JSON.stringify(data)) as T);
            return helper.createObjects(data);
        }        
        return new Promise((resolve, reject) => {
            resolve();
        });

      //  return new Promise<T>("NO_DATA");
    }

    public static parseQueryString(search: any): any  {
        let qs = new MongoQS();
        let query = qs.parse(search);

        return query;
    }

    public search<T extends BaseObj>(helper: BaseHelper<T>, search: any): Promise<HttpStatus<T[]>> {
        return(new Promise((resolve,reject)=>{
           // helper.onBeforeSearch(search);
            if(helper.classInfo.mongoCollectionName!='shops'){
                helper.onBeforeSearch(search);
            }   
            helper.getCacheObjIfHasAny(search).then((obj)=>{                
                resolve(obj);
            }).catch((err)=>{               
                this.fetch(helper, search, this.setCollection).then((obj1)=>{
                    helper.saveToCacheIfUnique(search,obj1.entity);
                    resolve(obj1);
                }).catch((err)=>{
                    reject(err);
                });
            });
        }));
    }

    public get<T extends BaseObj>(helper: BaseHelper<T>, search: any): Promise<HttpStatus<T>> {       
        if(helper.classInfo.mongoCollectionName!='shops'){
        helper.onBeforeGet(search);  
        }          
        return this.fetch(helper, search, this.setSingle);
    }

    private executeGetQuery(collection: any, search: any, classInfo: ClassInfo): any {
        if (classInfo.mongoGetAggregate != null){
            let getAggregate = classInfo.mongoGetAggregate;
			if (search) {
                getAggregate.unshift({ $match: search });               
			}            
            return collection.aggregate(getAggregate);
        }
        else if(classInfo.mongoGetQuery != null){
             return collection.find( classInfo.mongoGetQuery );
        }
        else{
            return collection.find( search );
        }
    }

    /**
    *
    * Delete by id
    *
    * @param helper Helper Object
    * @param id id of object
    *
    */

    public delete<T extends BaseObj>(helper: BaseHelper<T>, obj: T): Promise<HttpStatus<boolean>> {
        let promise: Promise<HttpStatus<boolean>> = new Promise((resolve, reject) => {
            let classInfo = helper.classInfo;
            let collectionName = classInfo.mongoCollectionName;
            if (MongoDB.MongoDB != null) {
                var collection = MongoDB.MongoDB.collection(collectionName);
                let criteria = { "_id": helper.objectID( obj._id) }
                helper.onBeforeDelete(obj)
                .then((success) => {
                    if(!success) {
                        resolve(new HttpStatus<boolean>(HttpStatus.UNAUTHORISED, null));
                        return;
                    }
                    helper.deleteFromCacheIfUnique(criteria,()=>{
                        collection.deleteOne(criteria).then((result) => {
                            helper.onAfterDelete(obj);
                            resolve(new HttpStatus<boolean>(HttpStatus.OK, true));
                        })
                        .catch((err) => {
                            reject(HttpStatus.getHttpStatus(err));
                        });
                    });
                })
                .catch((err)=> {
                    reject(HttpStatus.getHttpStatus(err));
                });
            }
            else {
                let httpStatus = new HttpStatus<boolean>(HttpStatus.SERVER_ERROR, null);
                httpStatus.message += ' mongo is null';
                reject(httpStatus);
            }
        });
        return promise;
    }

    /**
    *
    * Insert Object
    *
    * @param helper Helper Object
    * @param data data object
    *
    */
    public insert<T extends BaseObj>(helper: BaseHelper<T>, data: T): Promise<HttpStatus<T>> {        
        let promise: Promise<HttpStatus<T>> = new Promise((resolve, reject) => {
            let classInfo = helper.classInfo;
            let collectionName = classInfo.mongoCollectionName;
            if (MongoDB.MongoDB != null) {
                var collection = MongoDB.MongoDB.collection(collectionName);
                /* var parsedData = ModelData.getObjectContent<T>(data);  REPLACED WITH cleanEntity see below.  */

                let validationErrors = helper.onBeforeSave(data as any);
                if(validationErrors && validationErrors.length > 0)
                    reject(HttpStatus.getHttpStatus(new Error(validationErrors)));
                else {
                    data = this.cleanEntity<T>(data);
                    helper.onBeforeInsert(data)
                    .then((success) => {
                        if(!success) {
                            resolve(new HttpStatus(HttpStatus.UNAUTHORISED, null));
                            return;
                        }                       
                        collection.insertOne(data).then((result) => {
                            helper.onAfterInsert(data);
                            resolve(new HttpStatus<T>(HttpStatus.OK, data as T));
                        })
                        .catch((err) => {
                            reject(HttpStatus.getHttpStatus(err));
                        });
                    })
                    .catch((err) => {
                        reject(HttpStatus.getHttpStatus(err));
                    });
                }
            }
            else {
                let httpStatus = new HttpStatus<T>(HttpStatus.SERVER_ERROR, null);
                httpStatus.message += ' mongo is null';
                reject(httpStatus);
            }

        });
        return promise;
    }


    private cleanEntity<T extends BaseObj>(data: T): any{
        let cleanStringData = JSON.stringify(data, this.cleanEntityReplacer );
        return JSON.parse(cleanStringData);
    }

    private cleanEntityReplacer(key, value){
        if (value){

            /* delete the ignore rules and remove the referenced fields. */
            if ( value.__ignoreRules){
                let irs = value.__ignoreRules;
                for (var i = 0; i < irs.length; i++) {
                    var ir = irs[i];
                    if(ir.ignoreInDb)
                        delete  value[ir.propertyName]
                }
                delete value.__ignoreRules;
            }

            /* remove the validationRules */
            if(value.__validationRules)
                delete value.__validationRules;

            /* delete the _id parent field for mongo */
            if(key == "") {
                delete value._id;
            }

        }

        return value;
    }

    /**
   *
   * Update by a criteria
   *
   * @param helper Helper Object
   * @param criteria Json object to query
   * @param data Data will update
   *
   */
    public update<T extends BaseObj>(helper: BaseHelper<T>, criteria: T, data: any): Promise<HttpStatus<T>> {
        let obj = {};
        let promise: Promise<HttpStatus<T>> = new Promise((resolve, reject) => {
            this.get(helper, criteria)
                .catch((err) => {
                        let httpStatus = new HttpStatus<T>(HttpStatus.BAD_REQUEST, null);
                        httpStatus.message = err.message;
                        reject(httpStatus);
                 })
                .then((httpStatus: HttpStatus<T>) => {
                if (httpStatus.code === HttpStatus.OK) {
                    if (httpStatus.entity ) {
                        let classInfo = helper.classInfo;
                        let collectionName = classInfo.mongoCollectionName;
                        if (MongoDB.MongoDB != null) {
                            var collection = MongoDB.MongoDB.collection(collectionName);
                            let validationErrors = helper.onBeforeSave(data as any);
                            if(validationErrors && validationErrors.length > 0){
                                reject(HttpStatus.getHttpStatus(new Error(validationErrors)));
                            }
                            else {
                                data = this.cleanEntity<T>(data);
                                helper.onBeforeUpdate(data)
                                .then((success)=> {
                                    if(!success) {
                                        resolve(new HttpStatus(HttpStatus.UNAUTHORISED, null));
                                        return;
                                    }
                                    helper.deleteFromCacheIfUnique(criteria);                                                                      
                                    collection.updateOne(criteria, { '$set': data }).then((result) => {
                                        let resultData = helper.assignData(httpStatus.entity, data);
                                        helper.onAfterUpdate(httpStatus.entity);
                                        resolve(new HttpStatus<T>(HttpStatus.OK, resultData as T));
                                    })
                                    .catch((err) => {
                                        reject(HttpStatus.getHttpStatus(err));
                                    });
                                })
                                .catch((err) => {
                                    reject(HttpStatus.getHttpStatus(err));
                                });
                            }
                        }
                        else { //no mongo
                            let httpStatus = new HttpStatus<T>(HttpStatus.SERVER_ERROR, null);
                            httpStatus.message += ' mongo is null';
                            reject(httpStatus);
                        }
                    } else { //failed to retrieve thing to update
                        resolve(new HttpStatus(HttpStatus.NO_CONTENT, null));
                    }
                } else { //error returned on connecting to DB.
                    resolve(new HttpStatus<T>(httpStatus.code, null));
                }
            });
        });
        return promise;
    }

    private fetch<T extends BaseObj>(helper: BaseHelper<T>, search: any, setData: any): Promise<HttpStatus<T>> {
        if(helper.classInfo.mongoCollectionName!='shops'){
        search = helper.onBeforeFetch(search);
        }        
        let promise = new Promise((resolve, reject) => {
            let classInfo = helper.classInfo;
            let collectionName = classInfo.mongoCollectionName;
            if (MongoDB.MongoDB != null) {
                var collection = MongoDB.MongoDB.collection(collectionName);
                let results = this.executeGetQuery(collection, search, classInfo);
              //  let user = Base.activator(entity.classInfo.type);

                results.toArray((err, data) => {
                    if (!err) {
                        setData(helper, data)
                            .then((object) => {
                            helper.onAfterFetch(object)
                            .then((authorized)=> {
                                if(authorized != false) {
                                    if (object != null) {
                                        resolve(new HttpStatus<T>(HttpStatus.OK, object as T));
                                    }
                                    else {
                                        resolve(new HttpStatus<T>(HttpStatus.NO_CONTENT, null));
                                    }
                                }
                                else {                                  
                                    resolve(new HttpStatus<T>(HttpStatus.UNAUTHORISED, null));
                                }
                            });

                        } ).catch((err) => {
                            console.log(err);
                        });
                    }
                    else {
                        let httpStatus = new HttpStatus<T>(HttpStatus.SERVER_ERROR, null);
                        reject(httpStatus, err);
                        //return new Promise<any>(err);
                    }
                });
            }
            else {
                let httpStatus = new HttpStatus<T>(HttpStatus.SERVER_ERROR, null);
                httpStatus.message += " mongo is null";
                reject(httpStatus, null);

            }

        });
        return promise;
    }
    /**
    *
    * Insert many object in one time
    *
    * @param helper Helper Object
    * @param data Array of object
    *
    */
   public insertMany<T extends BaseObj>(helper: BaseHelper<T>, data: Array<any>): Promise<HttpStatus<Array<any>>> {
        // Check Array
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return new Promise((resolve, reject) => {
                resolve(new HttpStatus<T[]>(HttpStatus.OK, data));
            })
        }
        let insertPromise: Promise<HttpStatus<Array<any>>> = new Promise((resolve, reject) => {
            let validatePromiseList: Array<any> = [];
            let checkInvalid: boolean = false;
            let insertList: Array<any> = [];
            // Validate
            data.forEach(item => {
                insertList.push(item);
                let validatePromise: Promise<any> = new Promise((resolve, reject) => {
                    let validationErrors = helper.onBeforeSave(item as any);
                    if (validationErrors && validationErrors.length > 0)
                        reject(HttpStatus.getHttpStatus(new Error(validationErrors)));
                    else {
                        resolve(new HttpStatus<T>(HttpStatus.OK, item));
                    }
                });
                validatePromise
                    .then((data) => { })
                    .catch((err: ErrorHandler) => {
                        let httpStatus = new HttpStatus<any>(HttpStatus.BAD_REQUEST, null);
                        httpStatus.message = err.message;
                        if (!checkInvalid) {
                            checkInvalid = true;
                            reject(httpStatus);
                        }
                    });
                validatePromiseList.push(validatePromise);
            });
            Promise.all(validatePromiseList).then((values: Array<any>) => {
                // Validate success
                if (!checkInvalid) {
                    let classInfo = helper.classInfo;
                    let collectionName = classInfo.mongoCollectionName;
                    insertList.forEach(obj => {
                        obj = this.cleanEntity<T>(obj);                      
                        helper.onBeforeInsert(obj)
                    });
                    if (MongoDB.MongoDB != null) {
                        var collection = MongoDB.MongoDB.collection(collectionName);
                        collection.insertMany(insertList).then((result) => {
                            helper.onAfterInsertMany(data);
                            resolve(new HttpStatus<T[]>(HttpStatus.OK, result.ops));
                        })
                            .catch((err) => {
                                let httpStatus = new HttpStatus<T[]>(HttpStatus.SERVER_ERROR, null);
                                reject(httpStatus);
                            });
                    }
                    else {
                        let httpStatus = new HttpStatus<T[]>(HttpStatus.SERVER_ERROR, null);
                        httpStatus.message += ' mongo is null';
                        reject(httpStatus);
                    }
                }
            })
        });
        return insertPromise;
    }

    /**
     *
     * Update by a criteria
     *
     * @param helper Helper Object
     * @param criteria Json object to query
     * @param data Data will update
     *
     */
    public updateMany<T extends BaseObj>(helper: BaseHelper<T>, criteria: T, data: any): Promise<HttpStatus<boolean>> {
        let promise: Promise<HttpStatus<boolean>> = new Promise((resolve, reject) => {
            let classInfo = helper.classInfo,
                collectionName = classInfo.mongoCollectionName;
            if (MongoDB.MongoDB != null) {
                let collection = MongoDB.MongoDB.collection(collectionName);
                    collection.updateMany(criteria, { '$set': data }).then((result) => {
                        if(result.modifiedCount){
                            resolve(new HttpStatus<boolean>(HttpStatus.OK, true));
                        } else {
                            resolve(new HttpStatus<boolean>(HttpStatus.OK, false));
                        }
                    })
                    .catch((err) => {
                        reject(HttpStatus.getHttpStatus(err));
                    });
            }
            else { //no mongo
                let httpStatus = new HttpStatus<T>(HttpStatus.SERVER_ERROR, null);
                httpStatus.message += ' mongo is null';
                reject(httpStatus);
            }
        });
        return promise;

    }

    /**
    * [Deprecated] Delete many document by criteria
    * @param helper Helper Object
    * @param criteria criteria when delete
    *
    */
    public deleteMany<T extends BaseObj>(helper: BaseHelper<T>, criteria: any): Promise<HttpStatus<number>> {
        let promise: Promise<HttpStatus<number>> = new Promise((resolve, reject) => {
            let classInfo = helper.classInfo;
            let collectionName = classInfo.mongoCollectionName;

            if (MongoDB.MongoDB != null) {
                var collection = MongoDB.MongoDB.collection(collectionName);
                collection.removeMany(criteria).then((result) => {
                    helper.onAfterDeleteMany(criteria);//todo [Deprecated] this method should be passing in the object array... it was wrongly implmented and needs to be fixed or removed.
                    resolve(new HttpStatus<number>(HttpStatus.OK, result.deletedCount));
                })
                    .catch((err) => {
                        let httpStatus = new HttpStatus<number>(HttpStatus.SERVER_ERROR, null);
                        reject(httpStatus);
                    });
            }
            else {
                let httpStatus = new HttpStatus<number>(HttpStatus.SERVER_ERROR, null);
                httpStatus.message += ' mongo is null';
                reject(httpStatus);
            }
        });
        return promise;
    }

}


