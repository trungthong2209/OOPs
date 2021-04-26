import * as express from "express";
import BaseObj from "../../base/BaseObj";
import BaseHelper from "../../base/BaseHelper";
import HttpStatus from "../../base/HttpStatus";
import BaseEntity from "../../base/BaseEntity";
export default class RouteHelper {
  static INSERT_ACTION = "INSERT";
  static UPDATE_ACTION = "UPDATE";
  static SEARCH_ACTION = "SEARCH";
  static GET_ACTION = "GET";
  static DELETE_ACTION = "DELETE";

  static ARGUMENTS_NOT_VALID =
    "THE ARGUMENTS  YOU HAVE PROVIDED ARE NOT VALID!";
  static ARGUMENTS_NOT_PROVIDED = "A REQUIRED ARGUMENT HAS NOT BEEN PROVIDED!";

  public static createErrorResponseJSON(errorCode: String, errorMsg: String) {
    return {
      error: true,
      errorCode: errorCode,
      errorMsg: errorMsg
    };
  }

  public static processResponse<T>(
    res: express.Response,
    httpStatus: HttpStatus<T>
  ) {
    res.writeHead(httpStatus.code, httpStatus.message, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(httpStatus.entity, null, 2));
    res.end();
  }

  public static processErrorResponse<T extends BaseObj>(
    res: express.Response,
    err: HttpStatus<T>,
    helper: BaseHelper<T>
  ) {
    res.writeHead(err.code, err.message, { "Content-Type": "text/html" });
    res.write(
      "Failed to get, create or update " +
        helper.classInfo.mongoCollectionName +
        ". Check parameters are correct."
    );

    res.write(JSON.stringify(err));

    res.end();
  }

  public static processForbiddenResponse(
    res: express.Response,
    code: number,
    subject: string,
    message: string
  ) {    
    res.writeHead(code, subject, { "Content-Type": "text/html" });
    res.write(message);
    res.end();
  }

  public static processSecuredRoute<T extends BaseEntity<T>>(
    req: express.Request,
    res: express.Response,
    helper: BaseHelper<T>,
    action: string,
    access: string,
    obj: any = null,
    additionalFields: Array<string> = null,
    requiredFields: Array<string> = null
  ) {
    // TODO: need add authorization in here
    // SecurityEnforcer.checkAccess(access, req)
    // .catch(() => { noAccessToRoute(res); })
    // .then((user: User) => {
    //     helper.setUser(user); //user is passed in as null, so set it here now that it's been secured.
    this.processRoute(
      req,
      res,
      helper,
      action,
      obj,
      additionalFields,
      requiredFields
    );
    // });
  }

  public static processRoute<T extends BaseEntity<T>>(
    req: express.Request,
    res: express.Response,
    helper: BaseHelper<T>,
    action: string,
    obj: any = null,
    additionalFields: Array<string> = null,
    requiredFields: Array<string> = null
  ) {
    if (requiredFields == null) requiredFields = new Array<string>();

    if (action == RouteHelper.GET_ACTION) {
      helper.get(obj).then(httpStatus => {
        RouteHelper.processResponse(res, httpStatus);
      });
    } else if (action == RouteHelper.SEARCH_ACTION) {
      let queryStringSearch = req.query["search"];
      let search =  null;
      if (queryStringSearch)
          search = JSON.parse(queryStringSearch);

      if (search && search._id){
          search._id = helper.objectID(search._id);
      }

      //if (RouteHelper.checkRequest(req, res, helper, search, additionalFields, requiredFields )){
          helper.search(search)
          .then((httpStatus) => {
              RouteHelper.processResponse(res, httpStatus);
          })
          .catch((err) => {
              console.log(err);
          });
      //}
    } else if (action == RouteHelper.DELETE_ACTION) {      
      obj.assign(req.body);
      // requiredFields.push("_id"); //All delete operations must have the unique id.
      // if (
      //   RouteHelper.checkRequestForDelete(
      //     req,
      //     res,
      //     helper,
      //     obj,
      //     additionalFields,
      //     requiredFields
      //   )
      // ) {
      helper
        .delete(obj)
        .then(httpStatus => {
          RouteHelper.processResponse(res, httpStatus);
        })
        .catch(err => {
          RouteHelper.processErrorResponse(res, err, helper);
        });
      // }
    } else if (action == RouteHelper.INSERT_ACTION || action == RouteHelper.UPDATE_ACTION) {
      let promise: Promise<any> = null;
      if (action == RouteHelper.INSERT_ACTION) {
        obj.assign(req.body);       
        ///validate here.
        promise = helper.create(obj);
      } else {
        obj.assign(req.body.data);        
        if (req.body.criteria._id){
            req.body.criteria._id = helper.objectID(req.body.criteria._id);
        }        
        if (RouteHelper.checkRequest(req, res, helper, req.body.criteria, additionalFields, requiredFields )){
            promise = helper.update(req.body.criteria, obj);
        }
      }
      promise
        .then(httpStatus => {
          RouteHelper.processResponse(res, httpStatus);
        })
        .catch(err => {
          RouteHelper.processErrorResponse(res, err, helper);
        });
    }
  }

  private static checkRequestForDelete<T extends BaseEntity<T>>(
    req: express.Request,
    res: express.Response,
    helper: BaseHelper<T>,
    search: any,
    additionalFields: Array<string> = null,
    requiredFields: Array<string> = null
  ) {
    let obj = { _id: search._id };
    return this.checkRequest(
      req,
      res,
      helper,
      obj,
      additionalFields,
      requiredFields
    );
  }

  private static checkRequest<T extends BaseEntity<T>>(
    req: express.Request,
    res: express.Response,
    helper: BaseHelper<T>,
    search: any,
    additionalFields: Array<string> = null,
    requiredFields: Array<string> = null
  ) {
    if (search == null || search.length == 0) return true;

    let obj = helper.newInstance();
    if (obj.hasAllKeys(search, additionalFields) == false) {
      RouteHelper.processForbiddenResponse(
        res,
        403,
        "ERROR",
        RouteHelper.ARGUMENTS_NOT_VALID
      );
      return false;
    }

    if (requiredFields != null) {
      for (let i = 0; i < requiredFields.length; i++) {
        let requiredField = requiredFields[i];
        if (search[requiredField] == null) {
          RouteHelper.processForbiddenResponse(
            res,
            403,
            "ERROR: Arg missing (" + requiredField + ")",
            RouteHelper.ARGUMENTS_NOT_PROVIDED
          );
          return false;
        }
      }
    }
    return true;
  }
}
