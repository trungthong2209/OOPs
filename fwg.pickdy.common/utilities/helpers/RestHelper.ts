var rp = require('request-promise');
import AppConfiguration from '../AppConfig';
import BaseObj from '../../base/BaseObj';
import BaseHelper from '../../base/BaseHelper';
//import AppConfiguration from '../../config';
let Promise = require('promise');
import IPersisnance from '../../base/interfaces/IPersistance';
import HttpStatus from '../../base/HttpStatus';
import BaseEntity from '../../base/BaseEntity';
const queryString = require('query-string');
export default class RestHelper<T extends BaseObj> extends BaseObj implements IPersisnance {
    protected user:any;
    constructor(user:any = null) {
        super();
        this.configuration = AppConfiguration;
        this.user = user;
    }

    public configuration: any;

    /**
     * method overwritten as required.
     */
    public getToken(): string {
        let token: string = null;
        if(this.user != null && this.user.hasOwnProperty("token"))
            return this.user.token;
        try {
            if(typeof(localStorage) !== 'undefined' && localStorage.getItem('id_token')){
                return localStorage.getItem('id_token');
            } 
            else{
                return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjFiYWVkM2Y2MGRjNjc4ZjZjZGEyODkiLCJzaG9wSWQiOiI1Y2E0MmIzNjExZjZiNjE4NGY0YjRjZjciLCJ1c2VyTmFtZSI6Iml0Y2FmZSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYwNTg2MzMxMn0.4htujTgiGe7TRjUZXgb3aIGaTKXdLjlCHadsAgljuD8";
            }                   
        } catch (error) {
            console.log("Error: Manager class created with null user. Msg: " + error);
        }
    }

    public getLocationId(): string {
        if(this.user != null && this.user.hasOwnProperty("locationId"))
            return this.user.locationId;
        if(typeof(localStorage) !== 'undefined'){
            return localStorage.getItem('locationId');
        } else{
            return "";
        }
    }

    public objectID(obj: any): any {
        return obj;
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
        try {           
            let body = { criteria: criteria, data: data };
            let promise = new Promise((resolve, reject) => {
                let uri = this.GetBaseUrl(helper);//let uri = this.configuration.GetConfiguration(AppConfiguration.REST_API_HOST);
                if (helper.classInfo.endPoint != null) {
                    uri += '/' + helper.classInfo.endPoint;
                }
          
                //TODO refactor Viet. cut and past code.
                let options = {
                    'method': 'PUT',
                    'uri': uri,
                    'headers': {
                        'any-Agent': 'Request-Promise',
                        "x-wfg-token": this.getToken()
                    },
                    'body': body,
                    'json': true,
                    'resolveWithFullResponse': true
                }

                this.addLocationIdToHeaderOption(options);
                //TODO THIS IS DUPLICATE CODE RE-FACTOR.               
                rp(options)
                    .then((response) => {                        
                        helper.onAfterSave(response.body);
                        resolve(new HttpStatus<T>(HttpStatus.OK, response.body));
                    })
                    .catch(function (err) {
                        reject(HttpStatus.getHttpStatus(err));
                    });

            });
            return promise;
        } catch (err) {            
            throw new Promise((resolve, reject) => {
                reject(err as Error);
            });
        }
    }



    /**
    *
    * Delete Object by Id
    *
    * @param helper Helper Object
    * @param id Object Id
    *
    */
    public delete<T extends BaseObj>(helper: BaseHelper<T>, data: BaseEntity<T>): Promise<HttpStatus<boolean>> {
        let promise = new Promise((resolve, reject) => {
            let uri = this.GetBaseUrl(helper);//let uri = this.configuration.GetConfiguration(AppConfiguration.REST_API_HOST);
            if (helper.classInfo.endPoint != null)
                uri += "/" + helper.classInfo.endPoint;
            let options = {
                'method': 'DELETE',
                'uri': uri,
                'headers': {
                    'any-Agent': 'Request-Promise',
                    "x-wfg-token": this.getToken(),
                },
                'body': data,
                'json': true,
                'resolveWithFullResponse': true
            }

            this.addLocationIdToHeaderOption(options);          
            //TODO THIS IS DUPLICATE CODE RE-FACTOR.
            rp(options)
                .then((response) => {                   
                    resolve(new HttpStatus<T>(HttpStatus.OK, response.body));
                })
                .catch(function (err) {
                    reject(HttpStatus.getHttpStatus(err));
                });

        });
        return promise;
    }

    /**
    *
    * Insert Object by custom URI
    *
    * @param helper Helper Object
    * @param data data object
    *
    */
    public insert<T extends BaseObj>(helper: BaseHelper<T>, data: any): Promise<HttpStatus<T>> {
        try {
            let promise = new Promise((resolve, reject) => {
                let uri = this.GetBaseUrl(helper);//let uri = this.configuration.GetConfiguration(AppConfiguration.REST_API_HOST);
                if (helper.classInfo.endPoint != null)
                    uri += "/" + helper.classInfo.endPoint;
                //TODO refactor Viet. cut and past code.      
                let options = {
                    'method': 'POST',
                    'uri': uri,
                    'headers': {
                        'any-Agent': 'Request-Promise',
                        "x-wfg-token": this.getToken()
                    },
                    'body': data,
                    'json': true,
                    'resolveWithFullResponse': true
                }

                this.addLocationIdToHeaderOption(options);
                //TODO THIS IS DUPLICATE CODE RE-FACTOR.                
                rp(options)
                    .then((response) => {                       
                        helper.onAfterSave(response.body);
                        resolve(new HttpStatus<T>(HttpStatus.OK, response.body));
                    })
                    .catch(function (err) {
                        reject(HttpStatus.getHttpStatus(err));
                    });

            });
            return promise;
        } catch (err) {
            console.log(err)
            throw new Promise((resolve, reject) => {
                reject(err as Error);
            });
        }

    }



    /**
     *
     * Insert many object in one time
     *
     * @param helper Helper Object
     * @param data Array of object
     *
     */
    insertMany<T extends BaseObj>(helper: BaseHelper<T>, data: Array<T>): Promise<HttpStatus<Array<T>>> {
        try {
            // Check is Array
            if (!data || (Array.isArray(data) && data.length === 0)) {
                return new Promise((resolve, reject) => {
                    resolve(new HttpStatus<T[]>(HttpStatus.OK, data));
                })
            }

            let promise = new Promise((resolve, reject) => {
                // Check Array
                //TODO THIS IS DUPLICATE CODE RE-FACTOR.
                let uri = this.GetBaseUrl(helper); //let uri = this.configuration.GetConfiguration(AppConfiguration.REST_API_HOST);
                if (helper.classInfo.endPoint != null)
                    uri += "/" + helper.classInfo.endPoint + '/insertMany';
                //TODO refactor Viet. cut and past code.
                let options = {
                    'method': 'POST',
                    'uri': uri,
                    'headers': {
                        'any-Agent': 'Request-Promise',
                        "x-wfg-token": this.getToken()
                    },
                    'body': data,
                    'json': true,
                    'resolveWithFullResponse': true
                }

                // LocationId to indicate where location you are working on
                this.addLocationIdToHeaderOption(options);

                //TODO THIS IS DUPLICATE CODE RE-FACTOR.               
                rp(options)
                    .then((response) => {                       
                        helper.onAfterSaveMany(response.body);
                        resolve(new HttpStatus<T>(HttpStatus.OK, response.body));
                    })
                    .catch(function (err) {
                        reject(HttpStatus.getHttpStatus(err));
                    });

            });
            return promise;
        } catch (err) {
            console.log(err)
            throw new Promise((resolve, reject) => {
                reject(err as Error);
            });
        }
    }

    /**
    *
    * Update many by a criteria
    *
    * @param helper Helper Object
    * @param criteria Json object to query
    * @param data Data will update
    *
    */
    public updateMany<T extends BaseObj>(helper: BaseHelper<T>, criteria: T, data: any): Promise<HttpStatus<boolean>> {
        // No need update many
        return null;
    }

    /**
     * Delete many document by criteria
     * @param helper Helper Object
     * @param criteria criteria when delete
     */
    deleteMany<T extends BaseObj>(helper: BaseHelper<T>, criteria: any): Promise<HttpStatus<number>> {
        return null;
    }

    private GetBaseUrl<T extends BaseObj>(helper: BaseHelper<T>): string {
        let host = "";
        if(helper.classInfo.nameSpace == AppConfiguration.GetConfiguration(AppConfiguration.DEFAULT_NAMESPACE)) {
            host = this.configuration.GetConfiguration(AppConfiguration.REST_API_HOST);
        }
        else{
            let childConfig = this.configuration.GetChildConfiguration(helper.classInfo.nameSpace);
            host = childConfig.REST_API_HOST;
        }        
        return host;
    }

    private fetch<T extends BaseObj>(helper: BaseHelper<T>, search: string, setData: any): Promise<HttpStatus<T>> {
        //TODO THIS IS DUPLICATE CODE RE-FACTOR.
        let promise = new Promise((resolve, reject) => {
            helper.onBeforeFetch(search);
            let uri = this.GetBaseUrl(helper); //this.configuration.GetConfiguration(AppConfiguration.REST_API_HOST);
            if (helper.classInfo.endPoint != null)
                uri += "/" + helper.classInfo.endPoint;
            if(Object.prototype.toString.call(search) != '[object String]')
                search = JSON.stringify(search);
            if (search != null && search.toString().length > 0)
                uri += "/" + search;           
            let options = {
                "uri": uri,
                "headers": {
                    "x-wfg-token": this.getToken(),
                    'any-Agent': 'Request-Promise'

                },
                "json": true
            }        
            // LocationId to indicate where location you are working on
            this.addLocationIdToHeaderOption(options);           
            //TODO THIS IS DUPLICATE CODE RE-FACTOR.
            rp(options)
                .then(function (object) {                    
                    if(object) {             
                    
                        if (object != null) {                           
                            resolve(new HttpStatus<T>(HttpStatus.OK, object as T));
                        }
                        else {
                            resolve(new HttpStatus<T>(HttpStatus.NO_CONTENT, null));
                        }
                    }
                    else {
                        resolve(new HttpStatus<T>(HttpStatus.NOT_FOUND, null));
                    }
                })
                .catch(function (err) {
                    (err);
                    reject(HttpStatus.getHttpStatus(err));
                });

        });

        return promise;

    }


    /**
     * /
     * TODO: This method returns the item by doing a JSON.parse. It should be constructing an object and loading it.
     *
     * @param helper
     * @param data
     */
    private setSingle<T extends BaseObj>(helper: BaseHelper<T>, data): Promise<T> {
        let promise = new Promise((resolve, reject) => {
            if (data != null) {
                if(data.constructor === Array)
                    data = data[0];
                data = (JSON.parse(JSON.stringify(data)) as T);
                if (helper.newInstance() != null){
                    let d = helper.newInstance();
                    d.assign(data); //assigned to real object
                    resolve(d);
                }
                else{

                    resolve(data); //return json structure only.
                }
            }
            else {
                resolve(null);
            }
        });
        return promise;
    }

    /**
    * /
    * TODO: This method returns the item by doing a JSON.parse. It should be constructing an object and loading it.
    *
    * @param helper
    * @param data
    */
    protected setCollection<T extends BaseObj>(helper: BaseHelper<T>, data): Promise<T> {       
        // if (data.length > 0) {
        let promise = new Promise((resolve, reject) => {
            data = (JSON.parse(JSON.stringify(data)) as T);            
            if (helper.newInstance() != null && data.length > 0){
                let datas = new Array<any>();
                for (var i = 0; i < data.length; i++) {
                    var d = helper.newInstance();
                    d.assign(data[i]);
                    datas.push(d);
                }
                resolve(datas); //assigned to real object
            }
            else{
                resolve(data); //return of json object only.
            }
        });        
        return promise;
    }

    public search<T extends BaseObj>(helper: BaseHelper<T>, search: any): Promise<HttpStatus<Array<T>>> {
        let query = '?search=' + JSON.stringify(search);       
        return(new Promise((resolve,reject)=>{
                this.fetch(helper, query, this.setCollection).then((obj1)=>{           
                resolve(obj1);
            }).catch((err)=>{
            reject(err);
            });
        }));
    }

    public get<T extends BaseObj>(helper: BaseHelper<T>, search: any): Promise<HttpStatus<T>> {       
        return this.fetch(helper, search, this.setSingle);
    }

    private addLocationIdToHeaderOption(options) {
        let locationId = this.getLocationId();
        return locationId ? Object.assign(options.headers, {
                "LocationId": locationId
        }) : options;
    }
}