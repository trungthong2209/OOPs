import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import UnitsManager from "../../fwg.pickdy.pos.common/model/manager/UnitsManager";
import Units from "../../fwg.pickdy.pos.common/model/Units";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let unitsManager = new UnitsManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      unitsManager,
      RouteHelper.SEARCH_ACTION,
      "KM_DEFAULT_ROUTE"
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-UNIT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new UnitsManager(httpStatus.entity),
      RouteHelper.INSERT_ACTION,
      "KM_DEFAULT_ROUTE",
      new Units()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-UNIT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new UnitsManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Units()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-UNIT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new UnitsManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Units()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-UNIT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let unitsManager = new UnitsManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      unitsManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: unitsManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-UNIT-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
