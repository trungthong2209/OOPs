import express = require('express');
var jwt = require('express-jwt');
var jwtDecode = require('jwt-decode');
import HttpStatus from '../../base/HttpStatus';

import AppConfig from '../AppConfig';

var getProtectedRouteSecret  = function(req,payload,done){
    let theSecret =  AppConfig.GetConfiguration(AppConfig.AUTH0_APP_SECRET);
    let audienceSecrets = AppConfig.GetConfiguration(AppConfig.AUTH0_AUDIENCE_SECRETS);
    if(audienceSecrets != null && payload.aud != null && audienceSecrets[payload.aud] != null)
        theSecret = audienceSecrets[payload.aud];
    
    return done(null, theSecret);
}


export var ProtectedRoute = jwt({
    secret: getProtectedRouteSecret,
    audience: AppConfig.GetConfiguration(AppConfig.AUTH0_APP_CLIENT_ID) 
});




/*
 Get the users email address from the auth0 token payload. 
*/
ProtectedRoute.getUserEmail = function (req: any):string
{
    return ProtectedRoute.getPayloadField('email', req);
}

ProtectedRoute.getUserSub = function (req: any):string
{
    return ProtectedRoute.getPayloadField('sub', req);
}

ProtectedRoute.getToken = function (req: any): string {
    var token = req.headers['authorization'].split(' ')[1];
    return token;
}

/*
 Get the specified field from the auth0 token payload. 
*/
ProtectedRoute.getPayloadField = function (field:string, req: any): string {
    if(req.headers['authorization']){
        var token = req.headers['authorization'].split(' ') [1];
        let decoded = jwtDecode(token);

            return decoded[field];
    }
    return null;
}

/*
 Get the specified field from the auth0 token payload. 
*/
ProtectedRoute.getTokenPayloadField = function (field:string,  token: any): string {
    var decoded = jwtDecode(token);
    return decoded[field];
}

export function noAccessToRoute(res: express.Response) {    
    let httpStatus = new HttpStatus<any>(HttpStatus.UNAUTHORISED, null);
    res.writeHead(httpStatus.code, httpStatus.message, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(httpStatus.entity, null, 2));
    res.end();
}

export default ProtectedRoute;