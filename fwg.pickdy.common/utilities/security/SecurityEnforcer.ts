import express = require('express');

import "reflect-metadata";
import User from '../../model/User';
import HttpStatus from '../../base/HttpStatus';
import Promise = require('promise');
import {ProtectedRoute} from './ProtectedRoute';
import UserManager from '../../model/manager/UserManager';
var jwt = require('express-jwt');
var jwtDecode = require('jwt-decode');

class SecurityEnforcerHelper {

    public getToken(req: express.Request){
        let token: string = null;
        token = req.headers['authorization'];
        if(token){
            token = token.split(' ')[1];
        }
        return token;
    }

    public checkToken(token: any, user: User){
        try{
            var decoded = jwtDecode(token);
            return decoded["email"] == user.email;
        }
        catch(e){
            return false;
        }
    }

	private getUser(req: express.Request):User{
		let user = new User();
		user.token = this.getToken(req);
        user.email = ProtectedRoute.getUserEmail(req);
        user.auth0UserId = ProtectedRoute.getUserSub(req);
        return user;
    }
    private getLocationId(req: express.Request):string{
        return req.header['locationid'];
	}

    public checkAccess(dataAccessCodes: string, req: express.Request): Promise<User> {
        let user : User = this.getUser(req);
        let locationId = this.getLocationId(req);
        let search = null;
        /*
        if ( user.email)
            search = { email: user.email};
        else if(user.auth0UserId)
            search = {"auth0UserId" : user.auth0UserId};
            */
        
        if(user.auth0UserId)
            search = {"auth0UserId" : user.auth0UserId};

        let userManager = new UserManager(user);
        let promise = new Promise<User>((resolve, reject) => {
            let usePromise: any;
            let iterations = [];
            if (userManager.isApi()) {
                usePromise = userManager.search(search);                
            }
            else {
                usePromise = userManager.search(search);
            }
            usePromise
            .catch((e) => { 
                reject(e);
             })
            .then((httpStatus: HttpStatus<User>) => {
                if (httpStatus != null && httpStatus.entity != null) {
                    let retUser =   new User();
                    retUser.assign(httpStatus.entity[0]);
                    retUser.locationId = locationId;
                    if (retUser.hasDataAccesCodes(dataAccessCodes) == false) {                        
                        reject();
                    }
                    else {
                        httpStatus.entity.token = this.getToken(req);
						let userAccess = new User();
                        userAccess.assign(retUser);
                        if (userAccess.hasDataAccesCodes(dataAccessCodes) == false) {
                            reject('does not have access to access code ' + dataAccessCodes);
                        }
						else{
	                        resolve(retUser);
						}
                    }
                }
                else {
                    reject();
                }
            });
        });
        return promise;
    }
}


var SecurityEnforcer = new SecurityEnforcerHelper();
export default SecurityEnforcer;