import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import RawMaterialsInputManager from "../../fwg.pickdy.pos.common/model/manager/RawMaterialsInputManager";
import RawMaterialInputs from "../../fwg.pickdy.pos.common/model/RawMaterialInputs";
import RawMaterialinputService from "../services/RawMaterialinputService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let rawMaterialinputService = new RawMaterialinputService(httpStatus.entity);
    rawMaterialinputService.getAllRawMaterialInputs()
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-RAW_MATERIAL_INPUT ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new RawMaterialsInputManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-RAW_MATERIAL_INPUT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let rawMaterialinputService = new RawMaterialinputService(httpStatus.entity);
    let rawMaterialInputs = RawMaterialInputs.newInstance();
    rawMaterialInputs.assign(req.body);
    rawMaterialinputService.insertRawMaterialInputs(rawMaterialInputs).then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-POST-RAW_MATERIAL_INPUT ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new RawMaterialsInputManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-RAW_MATERIAL_INPUT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new RawMaterialsInputManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new RawMaterialInputs()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-RAW_MATERIAL_INPUT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new RawMaterialsInputManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new RawMaterialInputs()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-RAW_MATERIAL_INPUT ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let rawMaterialsInputManager = new RawMaterialsInputManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      rawMaterialsInputManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: rawMaterialsInputManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-RAW_MATERIAL_INPUT-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
