import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import StaffsManager from "../../fwg.pickdy.pos.common/model/manager/StaffsManager";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import StaffService from "../services/StaffService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let staffsManager = new StaffsManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      staffsManager,
      RouteHelper.SEARCH_ACTION,
      "KM_DEFAULT_ROUTE"
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-STAFFS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let staffService = new StaffService(httpStatus.entity);
    let staff = Staffs.newInstance();
    staff.assign(req.body);
    staffService.insertStaffs(staff).then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-POST-STAFFS ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new StaffsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-STAFFS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new StaffsManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Staffs()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-STAFFS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/changePassword", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {   
    let staffService = new StaffService(httpStatus.entity);
    let staffsManager: StaffsManager = new StaffsManager(httpStatus.entity);
    let staff = Staffs.newInstance();    
    staff.assign(req.body.data);
    if (req.body.criteria._id) {
     // req.body.criteria._id = staffsManager.objectID(req.body.criteria._id);
      staff._id = staffsManager.objectID(req.body.criteria._id);
    }
    staffService.changePassword(staff).then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-changePassword-STAFFS ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, staffsManager);
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-changePassword-STAFFS AUTHEN ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new StaffsManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Staffs()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-STAFFS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let staffsManager = new StaffsManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      staffsManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: staffsManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-STAFFS-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.post("/login", async (req: express.Request, res: express.Response) => {
  let staffService = new StaffService(null);
  let staff = Staffs.newInstance();
  staff.assign(req.body);
  staffService.login(staff).then((httpStatus) => {
    RouteHelper.processResponse(res, httpStatus);
  })
    .catch((err) => {
      PickdyLogHelper.error('ROUTER-LOGIN-STAFFS ' + JSON.stringify(err));
      RouteHelper.processErrorResponse(res, err, new StaffsManager(null));
    });
});
export default router;
