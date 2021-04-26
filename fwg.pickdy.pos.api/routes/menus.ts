import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import MenusManager from "../../fwg.pickdy.pos.common/model/manager/MenusManager";
import Menus from "../../fwg.pickdy.pos.common/model/Menus";
import MenuService from "../services/MenuService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let menusManager = new MenusManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      menusManager,
      RouteHelper.SEARCH_ACTION,
      "KM_DEFAULT_ROUTE"
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-MENU ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/getAllProductItemsByMenuId/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let menuService = new MenuService(httpStatus.entity);
    menuService.getAllProductItemsByMenuId(req.params["id"])
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-getAllProductItemsByMenuId ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new MenusManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-getAllProductItemsByMenuId ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new MenusManager(httpStatus.entity),
      RouteHelper.INSERT_ACTION,
      "KM_DEFAULT_ROUTE",
      new Menus()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-MENU ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new MenusManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Menus()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-MENU ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new MenusManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Menus()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-MENU ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let menusManager = new MenusManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      menusManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: menusManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-MENU-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
