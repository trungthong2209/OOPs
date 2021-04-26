
import * as express from 'express';
import Staffs from '../../../fwg.pickdy.pos.common/model/Staffs';
import HttpStatus from '../../../fwg.pickdy.common/base/HttpStatus';
import AppConfig from '../../../fwg.pickdy.common/utilities/AppConfig';
import StaffsManager from '../../../fwg.pickdy.pos.common/model/manager/StaffsManager';
import ShopsManager from '../../../fwg.pickdy.pos.common/model/manager/ShopsManager';
let jwt = require('jsonwebtoken');
export default class AuthenticationHelper {  
    public static checkAccess(dataAccessCodes: string, req: express.Request): Promise<HttpStatus<Staffs>> {
        let promise = new Promise<HttpStatus<Staffs>>((resolve,reject)=>{ 
            let token = req.headers['x-wfg-token'];       
            let device = req.headers['x-wfg-device'];             
            if(token){
                jwt.verify(token,AppConfig.GetConfiguration(AppConfig.AUTH0_APP_SECRET),(err,decoded)=>{ 
                    if(err){
                        let rejectStatus = new HttpStatus<Staffs>(HttpStatus.NOT_ACCEPTABLE, null);
                        rejectStatus.message = err.message;
                        reject(rejectStatus);
                    } else {
                        let staffsManager = new StaffsManager(null);
                        let shopsManager = new ShopsManager(null);
                        let pipeList = [];
                        if(decoded._id && decoded.shopId && decoded.role){                    
                            pipeList = [{
                                $match: {
                                    _id: staffsManager.objectID(decoded._id),
                                    shopId:shopsManager.objectID(decoded.shopId),
                                    role:decoded.role,
                                    token:token
                            }}];
                            if(device && device==='MOBILE'){
                                pipeList = [{
                                    $match: {
                                        _id: staffsManager.objectID(decoded._id),
                                        shopId:shopsManager.objectID(decoded.shopId),
                                        role:decoded.role,
                                        tokendevice:token
                                    }
                                }]
                            }                            
                            staffsManager.classInfo.mongoGetAggregate = pipeList;                           
                            staffsManager.search(null).then((httpStatus: HttpStatus<Array<Staffs>>) => {
                                staffsManager.classInfo.mongoGetAggregate = null;                                    
                                if(httpStatus.entity && httpStatus.entity.length>0){                                    
                                    let httpStatusStaff = new HttpStatus(httpStatus.code,httpStatus.entity[0]);                                       
                                    resolve(httpStatusStaff); 
                                } else {
                                    let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                                    rejectStatus.message ='NOT AUTHORIZATE';                                     
                                    reject(rejectStatus);
                                }                                
                            }).catch((err) => {
                                let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                                rejectStatus.message ='NOT AUTHORIZATE';                                     
                                reject(rejectStatus);
                              });
                        }  else {
                            let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                            rejectStatus.message ='TOKEN INVALID';
                            reject(rejectStatus);
                        }                       
                    }        
                });
            } else {
                // DEV NO AUTHEN TOKEN
                let rejectStatus = new HttpStatus<Staffs>(HttpStatus.UNAUTHORISED, null);
                rejectStatus.message ='TOKEN NOT EXISTED';
                reject(rejectStatus);              
            }            
        });
        return promise;
    }   
}
export function noAccessToRoute(res: express.Response) {    
    let httpStatus = new HttpStatus<any>(HttpStatus.UNAUTHORISED, null);
    res.writeHead(httpStatus.code, httpStatus.message, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(httpStatus.entity, null, 2));
    res.end();
}