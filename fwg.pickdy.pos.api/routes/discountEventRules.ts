import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import DiscountEventRulesManager from "../../fwg.pickdy.pos.common/model/manager/DiscountEventRulesManager";
import DiscountEventRules from "../../fwg.pickdy.pos.common/model/DiscountEventRules";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let discountEventRulesManager = new DiscountEventRulesManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      discountEventRulesManager,
      RouteHelper.SEARCH_ACTION,
      "KM_DEFAULT_ROUTE"
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-DiscountEventRules ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new DiscountEventRulesManager(httpStatus.entity),
      RouteHelper.INSERT_ACTION,
      "KM_DEFAULT_ROUTE",
      new DiscountEventRules()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-DiscountEventRules ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// update category
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new DiscountEventRulesManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new DiscountEventRules()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-DiscountEventRules ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new DiscountEventRulesManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new DiscountEventRules()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-DiscountEventRules ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// get category by Id
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let discountEventRulesManager = new DiscountEventRulesManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      discountEventRulesManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: discountEventRulesManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-DiscountEventRules-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
