﻿import BaseObj from './BaseObj';
import BaseEntity from './BaseEntity';
import HttpStatus from './HttpStatus';
let Promise = require('promise');
import Constants from './Constants';
import ClassInfo from './ClassInfo';
import { ValidatorHelper } from '../utilities/validation/Validator';
import IPersisnance from "./interfaces/IPersistance";
import ICache from "./interfaces/ICache";
import IAppAttachments from "./interfaces/IAppAttachments";
import AppConfig from "../utilities/AppConfig";
import RestHelper from "../utilities/helpers/RestHelper";
//import any from '../model/any';
import WebSocketClientHelper from '../utilities/helpers/WebSocketClientHelper';
import DispatcherManager from '../model/manager/DispatcherManager';
import Dispatcher, { EventType } from '../model/Dispatcher';
import { IsoDateHelper } from '../utilities/helpers/IsoDateHelper';
// import {SocketConnection} from '../utilities/helpers/WebSocketServer';

export class ManagedData{
    public criteria: any;
    public data: any;
    public functions: Array<any>
    public identifier:string=null;

    constructor(criteria, data, functions: Array<any> = null, identifier = null){
        this.functions = new Array<any>();
        this.criteria = criteria;
        this.data = data;
        this.identifier = identifier;
        if(functions && functions.length > 0){
            functions.forEach(fn => {
                this.functions.push(fn);
            });
        }
    }

}

export default class BaseHelper<T extends BaseObj> extends BaseObj {
    protected appAttachments: IAppAttachments = null;
    public user: any;
    public classInfo: ClassInfo;
    protected dispatcherManager: DispatcherManager;
    protected managedDatas: Array<ManagedData>;
    protected getPersistance(): IPersisnance  {     
    if (this.appAttachments == null){        
        return new RestHelper<T>();
    }         
        return this.appAttachments.getPersistance <T>(this.classInfo, this.user);
    }

    protected getCache(): ICache  {
        if (this.appAttachments == null)
            return null;

        return this.appAttachments.getCache <T>(this.classInfo, this.user);
    }

    public newInstance(): BaseEntity<T>{
        return null;
    }

    public objectID(obj: any): any {
        return this.getPersistance().objectID(obj);
    }

    get persistance(): IPersisnance {
        return this.getPersistance();
    }

    get cache(): ICache {
        return this.getCache();
    }
    constructor( user: any, webSocketClientHelper: WebSocketClientHelper = null) {
        super();
        this.user = user;
        this.classInfo = new ClassInfo();
        this.appAttachments =  AppConfig.GetAppAttachments();
        // this.SetAttachmentMethod();
        if(this.isApi() == false && webSocketClientHelper != null){
            this.registerForClientSocketEvents(webSocketClientHelper);
        }
    }
    /**
     * Sets a user if created with null.
     * @param user
     */
    public setUser(user: any) {
       this.user = this.user == null ? user: null;
       //return null;
    }

     protected SetAttachmentMethod(){
        if (this.isApi() ){
            this.appAttachments.SetAttachmentMethod(this);
        }
     }


    public isApi():boolean{
        if (this.appAttachments == null)
           return false;
        return true;
    }

    public objectIDs(arr: Array<any>) : Array<any>{
        let retVal = new Array<any>();
        for (let val of arr) {
            retVal.push(this.objectID(val));

        }
        return retVal;
    }

    public createObject(data): Promise<T> {
        throw new Error(Constants.METHOD_NOT_IMPLMENTED);
    }

    public onBeforeAssign(data: any, user: any): Promise<any>{
        let promise = new Promise((resolve, reject) => {
           resolve();
        });
        return promise;
    }

    public assignArray(arr: Array<any>, collection: any) {
        for (let elm of collection) {
            arr.push(elm);
        }
    }

    public createObjects(datas:Array<T>):  Promise<Array<T>> {
        let promise = new Promise((resolve, reject) => {
            let returnArr: Array<T> = new Array<T>();
            let promiseArr: Array<Promise<T>> = new Array<Promise<T>>();
            for (let data of datas) {
                let innerPromise = this.createObject(data);
                promiseArr.push(innerPromise);
                innerPromise.then((obj) => {
                    returnArr.push(obj);
                })
            }
            Promise.all(promiseArr).then(()=>{
                resolve(returnArr);
            }).catch((err)=>{
                reject(err);
            })
        });
        return (promise);
    }

    protected assignCollection<T extends BaseObj>(arr, returnArr, helper: BaseHelper<T>): Promise<T> {
        let promise = new Promise((resolve, reject) => {
            let promiseArr: Array<Promise<T>> = new Array<Promise<T>>();
            var count = arr.length;

			if (count == 0) {
                resolve(returnArr);
            }

            for (let elm of arr) {
                let innerPromise = helper.createObject(elm);
                promiseArr.push(innerPromise);
                innerPromise.then((data) => {
                    returnArr.push(data);
                })
            }
            Promise.all(promiseArr).then(()=>{
                resolve(returnArr);
            }).catch((err)=>{
                reject(err);
            })
        });
        return (promise);
    }

    private getCacheUniqueObjIdentifier(search:any):string{
        let obj = this.newInstance();
        let uniqueIdentifiers = obj.getUniqueIdentifiers()
        if(uniqueIdentifiers && search){
            let searchRedisFields = [];
            for(var i in uniqueIdentifiers){
                if(search[i] != null){  //and only key.
                    if(typeof search[i] == "string"){
                        searchRedisFields.push(i);                       
                    }
                }
            }
            if(searchRedisFields.length>0){
                return AppConfig.getEnvironmentName()+":"+this.classInfo.mongoCollectionName + ":" + searchRedisFields.join("-")+":"+search[i];
            }else{
                return null;
            }
        }
        return null;
    }
    public getCacheObjIfHasAny(search: any): Promise<HttpStatus<T>>{
        return(new Promise((resolve,reject)=>{
            if(this.newInstance() != null && this.newInstance().cacheOn && AppConfig.GetConfiguration(AppConfig.CACHE_ON)){
                //if the search object (above) includes the T objects
                let key = this.getCacheUniqueObjIdentifier(search);
                if(key!=null){
                    try{
                        if(this.getCache()!=undefined){
                            this.getCache().get(this,key).then((data)=>{
                                resolve(data);
                            }).catch(()=>{
                                reject(null);
                            });
                        }else{
                            reject("this.getCache() returns undefined");
                        }
                    }catch(err){
                        reject(err);
                    }
                }else{
                    reject(null);
                }
            }else{
                reject(null);
            }
        }));
    }
    public deleteFromCacheIfUnique(search: any,callback?){
        return(new Promise((resolve,reject)=>{
            if(this.newInstance() != null && this.newInstance().cacheOn && AppConfig.GetConfiguration(AppConfig.CACHE_ON)){
                let key = this.getCacheUniqueObjIdentifier(search);
                if(key!=null){
                    try{
                        //this.getCache().delete(this,"orders:_id*");
                        this.getCache().delete(this,key).then((response)=>{
                            callback();
                        }).catch((err)=>{
                            callback();
                        });
                    }catch(err){
                        callback();
                    }
                }else{
                    callback();
                }
            }else{
                callback();
            }
        }));
    }
    public saveToCacheIfUnique(search: any, data: T):void{
        if(this.newInstance() != null && this.newInstance().cacheOn && AppConfig.GetConfiguration(AppConfig.CACHE_ON)){
            let key = this.getCacheUniqueObjIdentifier(search);
            if(key!=null){
                try{
                    this.getCache().set(this,key,JSON.stringify(data));
                }catch(err){

                }
            }
        }
    }

    public onBeforeSearch<T>(search: any){
        if(this.user!=null && this.user.hasOwnProperty("shopId")){
            if(search!=null && !search.hasOwnProperty("shopId")){
                search['shopId'] = this.objectID(this.user.shopId);
            }           
        }
        //return null;
    }
    public onBeforeGet(search: any){
        if(this.user!=null && this.user.hasOwnProperty("shopId")){
            if(search!=null && !search.hasOwnProperty("shopId")){
                search['shopId'] = this.objectID(this.user.shopId);
            }                
        }
    }

    //Business Logic to implment before fetch.
    public onBeforeFetch(search: any) :any{
        if(this.user!=null && this.user.hasOwnProperty("shopId")){
            if(search==null){
                search= {shopId:this.objectID(this.user.shopId)};
            }            
        }
        return search;
    }

    /**
     * Returns whether request was valid at object level. Implemented in child Manager classes. Default is valid request (true).
     */
    public onAfterFetch(object: T): Promise<boolean> {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            },0);
        });
        return promise;
    }

    public onBeforeSave<T extends BaseEntity<T>>(object: T): string {
        if(this.user!=null && this.user.hasOwnProperty("shopId")){
            if(object!=null && object.hasOwnProperty("shopId")){
                object['shopId'] = this.objectID(this.user.shopId);
            }            
        }       
        return ValidatorHelper.validate<T>(object);  //OVERRIDE IN MANAGER CLASS AS REQUIRED.
    }

    public onAfterSave(object: T) {
        if (this.isApi() == false && this.getItemLocalStorage() != null && this.getItemLocalStorage()._id == object._id){
            this.setLocalStorage(object);
        }
    }

    public onAfterInsert(object: T) {
        this.onDispatch(EventType.DataInserted, object);
    }

    public onAfterUpdate(object: any) {
       this.onDispatch(EventType.DataUpdated, object);
    }

    onAfterInsertMany(object: Array<T>){
      this.onDispatchMany(EventType.DataInserted, object);
    }

    onAfterUpdateMany(object: Array<T>){
        this.onDispatchMany(EventType.DataUpdated, object);
    }


    public onAfterSaveMany(object: Array<T>) {

    }

    /**
     * Checks user has permission to delete object before it's deleted. Defaults true. TODO default false.
     * @param object
     */
    public onBeforeDelete(object: T): Promise<boolean> {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            },0);
        });
        if(this.user!=null && this.user.hasOwnProperty("shopId")){
            if(object!=null && object.hasOwnProperty("shopId")){
                object['shopId'] = this.objectID(this.user.shopId);
            }            
        }
        return promise;
    }

    /**
     * Checks user has permission to update object before it's updated. Defaults true. TODO default false.
     * @param object
     */
    public onBeforeUpdate(object: T): Promise<boolean> {
        let promise = new Promise((resolve, reject) => {
             setTimeout(() => {
                 //set shopID for all colecttion
                 if(this.user!=null && this.user.hasOwnProperty("shopId")){
                    if(object!=null && object.hasOwnProperty("shopId")){
                        object['shopId'] = this.objectID(this.user.shopId);
                    }            
                }
                if(this.user!=null && this.user.hasOwnProperty("shopId")){
                    if(object!=null && object.hasOwnProperty("updateByUserId")){
                        object['updateByUserId'] = this.user._id;
                    }            
                }                
                if(object.hasOwnProperty("updateDateTime")){
                    object["updateDateTime"] = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                }                   
                if(object.hasOwnProperty("createDateTime")){
                    object["createDateTime"] = IsoDateHelper.convertIsoDate(object["createDateTime"]);
                }    
                if(object.hasOwnProperty("orderDateTime")){
                    object["orderDateTime"] = IsoDateHelper.convertIsoDate(object["orderDateTime"]);
                }            
                resolve(true);
            },0);
        });
        return promise;
    }

    /**
     * Checks user has permission to insert object before it's inserted. Defaults true. TODO default false.
     * @param object
     */
    public onBeforeInsert(object: T): Promise<boolean> {
        let promise = new Promise((resolve, reject) => {
               setTimeout(() => {
                //set shopID for all colecttion
                 if(this.user!=null && this.user.hasOwnProperty("shopId")){
                    if(object!=null && object.hasOwnProperty("shopId")){
                        object['shopId'] = this.objectID(this.user.shopId);
                    }            
                }
                if(this.user!=null && this.user.hasOwnProperty("shopId")){
                    if(object!=null && object.hasOwnProperty("createByUserId")){
                        object['createByUserId'] = this.user._id;
                    }            
                }
                if(object.hasOwnProperty("createDateTime")){
                    object["createDateTime"] = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                }
                if(object.hasOwnProperty("orderDateTime")){
                    object["orderDateTime"] = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                }                        
                resolve(true);
            },0);
        });
        return promise;
    }

    public onAfterDelete(object: any) {
        this.onDispatch(EventType.DataDeleted, object);
    }

    public onAfterDeleteMany(object:Array<T>) {
        this.onDispatchMany(EventType.DataDeleted, object);
    }

    protected onDispatch(eventType: EventType, object: T){
        if(this.dispatcherManager != null){
            let criteria =  this.authCriteria(object);
            this.dispatcherManager.dispatch(eventType, object, this, criteria);
        }
    }

    public authCriteria(object: T): any{
        return null;
    }

    protected onDispatchMany(eventType: EventType, object:Array<T> ){
        if(this.dispatcherManager != null)
            this.dispatcherManager.dispatchMany(eventType, object, this);
    }

    public execute(action: string, data: any){
        if (this.isApi())
            this.executeAPI(action, data);
        else
            this.executeClient(action, data);
    }

    public executeAPI(action: string, data: any): Promise<HttpStatus<T>> {
        throw Error(Constants.ERROR_NOT_IMPLMENTED);
    }

    public executeClient(action: string, data: any): Promise<HttpStatus<T>> {
        throw Error(Constants.ERROR_NOT_IMPLMENTED);
    }

    public get(search: any): Promise<HttpStatus<T>> {
        return this.getPersistance().get(this, search);
    }

    public search(search: any): Promise<HttpStatus<Array<T>>>{
       return this.getPersistance().search(this, search);
    }

	public update(search: any, data: T): Promise<HttpStatus<T>> {
      return this.getPersistance().update(this, search, data);
    }

    public updateMany<T extends BaseObj>(criteria: any, data: any): Promise<HttpStatus<boolean>> {
        return this.getPersistance().updateMany(this, criteria, data);
    }

    public create(data: T): Promise<HttpStatus<T>> {
        return this.getPersistance().insert(this, data);
    }

	public insert(data: T): Promise<HttpStatus<T>> {  
      return this.getPersistance().insert(this, data);
    }


	public delete(data: T): Promise<HttpStatus<boolean>> {
       return this.getPersistance().delete(this, data);
    }

	public insertMany(data: Array<T>): Promise<HttpStatus<Array<T>>> {
		if (!data || (Array.isArray(data) && data.length === 0)) {
            return new Promise((resolve, reject) => {
                resolve(new HttpStatus<T[]>(HttpStatus.OK, data));
            });
        }

        return this.getPersistance().insertMany(this, data);
    }

    public deleteManyByCriteria(criteria:any): Promise<HttpStatus<number>>{
        return this.getPersistance().deleteMany(this, criteria);
    }

    public deleteMany(data: Array<T>): Promise<HttpStatus<number>> {
        return this.getPersistance().deleteMany(this, data);
    }

    public assignData(baseObj: any, data){
       Object.keys(data).forEach(key => {
            baseObj[key] = data[key];
        })
        return baseObj;
    }

    public sortDate(data: Array<T>, fieldName:string, sortAssending= true): Array<T> {
        data.sort((si1, si2) => {
            if(sortAssending)
                return Date.parse(si1[fieldName]) - Date.parse(si2[fieldName]);

           return Date.parse(si2[fieldName]) - Date.parse(si1[fieldName]);
       });

       return data;
    }

    public sort<T>(data: Array<T>, fieldName:string, sortAssending= true): Array<T> {
        return BaseHelper.sort<T>(data, fieldName, sortAssending);
    }

    public static sort<T>(data: Array<T>, fieldName:string, sortAssending= true): Array<T> {
        data.sort((si1, si2) => {
           if (si1[fieldName] > si2[fieldName] && sortAssending ) return 1;
           if (si1[fieldName] < si2[fieldName]  && sortAssending ) return -1;

           if (si1[fieldName] > si2[fieldName] && !sortAssending ) return -1;
           if (si1[fieldName] < si2[fieldName]  && !sortAssending ) return 1

           return 0;
       });

       return data;
    }

    public removeArrayItemById(array:Array<BaseEntity<T>>, idValue ){
        for (var i = array.length -1; i >=0; i--) {
            if(array[i]._id == idValue || array[i]._id.toString() ==  idValue.toString())
                array.splice(i, 1);
        }
    }

    public getItemLocalStorage(){
        let obj = null;
        if (typeof (localStorage) !== "undefined" && localStorage !== null) {
            let json = localStorage.getItem(this.classInfo.mongoCollectionName + "_");
            if (json && json != "undefined")
                obj = JSON.parse(json);
        }
        return obj;
    }

    public setLocalStorage(object: any){
        if (typeof (localStorage) !== "undefined" && localStorage !== null) {
            let json = JSON.stringify(object);
            localStorage.setItem(this.classInfo.mongoCollectionName + "_", json );
        }
    }

    public registerForClientSocketEvents(webSocketClientHelper: WebSocketClientHelper){
        if (this.isApi()){
            throw Error("registerForSocketEvents can only be called from the client.");
        }

        webSocketClientHelper.addClientMessageHandler(this);
        this.managedDatas = new Array<ManagedData>();
    }

    public removeManagedData(){
        this.managedDatas = new Array<ManagedData>();
    }

    public addSubscriber(criteria: any, func:any, identifier: string = null){
        let functions = new Array<any>();
        functions.push(func);
        this.addManagedData(criteria, null, functions, identifier );
    }

    public addManagedData(criteria: any, data: any, functions:Array<any>= null, identifier: string = null){

        if(identifier && this.managedDatas.find(x => x.identifier == identifier) != null){
            let index = this.managedDatas.findIndex(x => x.identifier == identifier);
            this.managedDatas[index].data = data;
            this.managedDatas[index].criteria = criteria;
            this.managedDatas[index].functions = functions;
        }
        else{
            let managedData = new ManagedData(criteria, data, functions, identifier);
            this.managedDatas.push(managedData);
        }
    }
    public getManagedDataLength():number{
        if(this.managedDatas){
            return this.managedDatas.length;
        }
        return 0;
    }

    public handleAllClientSocketEvent(message: any){
        let dispatcher = message.data;
        if (dispatcher.nameSpace == this.classInfo.nameSpace && dispatcher.mongoCollectionName == this.classInfo.mongoCollectionName){
            this.handleClientSocketEvent(dispatcher);
        }
    }

    public  handleClientSocketEvent(dispatcher: Dispatcher){ 


    }

    private excuteActionEvents(matchingManagedData: ManagedData, eventType: EventType, data: any, oldData: any = null){
        if(matchingManagedData.functions != null && matchingManagedData.functions.length > 0){
            for (let j = 0; j < matchingManagedData.functions.length; j++) {
                let fn = matchingManagedData.functions[j];
                if(eventType == EventType.DataUpdated) {
                    fn(eventType, data, oldData);
                }
                else {
                    fn(eventType, data);
                }
            }
        }
    }

    private getMatchingManagedData(dispatcher: Dispatcher){
        let matchingManagedData = new Array<ManagedData>();
        if (dispatcher.eventType == EventType.DataUpdated || dispatcher.eventType == EventType.DataDeleted ){
            for (let i = 0; i < this.managedDatas.length; i++) {
                var managedData = this.managedDatas[i];
                if(managedData.functions != null  && managedData.criteria != null && managedData.data == null){
                    matchingManagedData.push(managedData);
                }
                else if (managedData.data._id == dispatcher.id){
                    matchingManagedData.push(managedData);
                }
                else if(managedData.data.constructor == Array){
                    let matched = managedData.data.find( x=> x._id == dispatcher.id);
                    if (matched)
                        matchingManagedData.push(managedData);
                }
            }
        }
        else{
            return this.managedDatas;
        }
        return matchingManagedData;
    }

    private deleteManagedData(dispatcher: Dispatcher, data: any){
        if (data && data.constructor == Array){
            let index = data.findIndex(x => x._id == dispatcher.id);
            if (index >= 0){
                data.splice(index, 1);
            }
        }
        else{
            data = null;
        }
    }

    private insertManagedData(newData: any, data: any){
        if (data.constructor == Array){
            let foundData = data.find(x => x._id == newData._id);
            if(foundData){
                foundData.assign(newData);
            }
            else{
                data.push(newData);
            }
        }
        else if(data){
            data = newData;
        }
    }

    private updateManagedData(newData: any, datas: any){
        if (datas.length){
            for (var j = 0; j < datas.length; j++) {
                var data =datas[j];
                if (data._id == newData._id){
                    let oldData = JSON.parse(JSON.stringify(data));
                    datas[j].assign(newData);
                    return oldData;
                }
            }
        }
        else{
            let oldData = JSON.parse(JSON.stringify(datas));
            datas.assign(newData);
            return oldData;
        }
        return null; //not updated
    } 

}