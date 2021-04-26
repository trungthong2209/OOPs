import * as express from "express";
import RouteHelper from '../../fwg.pickdy.common/utilities/helpers/RouteHelper';
import TableManager from "../../fwg.pickdy.pos.common/model/manager/TableManager";
import Tables from "../../fwg.pickdy.pos.common/model/Tables";
import TablesManager from "../../fwg.pickdy.pos.common/model/manager/TableManager";
import TablesService from "../services/TablesService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let tableManager = new TableManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      tableManager,
      RouteHelper.SEARCH_ACTION,
      "KM_DEFAULT_ROUTE"
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-TABLES ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new TableManager(httpStatus.entity),
      RouteHelper.INSERT_ACTION,
      "KM_DEFAULT_ROUTE",
      new Tables()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-TABLES ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.post("/generateTables", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let tables: Tables = new Tables();
    tables.assign(req.body);
    let tablesService = new TablesService(httpStatus.entity);
    tablesService.genTables(tables).then(httpStatus => {
      RouteHelper.processResponse(res, httpStatus);
    })
      .catch(err => {
        PickdyLogHelper.error('ROUTER-generateTables-TABLES ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new TableManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-generateTables-TABLES ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// update category
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new TableManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Tables()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-TABLES ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new TableManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Tables()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-TABLES ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let tableManager = new TableManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      tableManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: tableManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-TABLES-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
