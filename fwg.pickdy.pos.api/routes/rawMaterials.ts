import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import RawMaterialsManager from "../../fwg.pickdy.pos.common/model/manager/RawMaterialsManager";
import RawMaterials from "../../fwg.pickdy.pos.common/model/RawMaterials";
import RawMaterialService from "../services/RawMaterialService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let rawMaterialService = new RawMaterialService(httpStatus.entity);
    rawMaterialService.getAllRawMaterials(null)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-RAW_MATERIAL ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new RawMaterialsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-RAW_MATERIAL ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new RawMaterialsManager(httpStatus.entity),
      RouteHelper.INSERT_ACTION,
      "KM_DEFAULT_ROUTE",
      new RawMaterials()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-RAW_MATERIAL ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new RawMaterialsManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new RawMaterials()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-RAW_MATERIAL ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new RawMaterialsManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new RawMaterials()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-RAW_MATERIAL ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let rawMaterialsManager = new RawMaterialsManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      rawMaterialsManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: rawMaterialsManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-RAW_MATERIAL-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
