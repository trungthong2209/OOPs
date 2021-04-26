import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import ProductItemsService from "../services/ProductItemsService";
import ProductItemsManager from "../../fwg.pickdy.pos.common/model/manager/ProductItemsManager";
import ProductItemModifierList from "../../fwg.pickdy.pos.common/model/ProductItemModifierList";
import ProductItemModifier from "../../fwg.pickdy.pos.common/model/ProductItemModifier";
import ProductItemModifierManager from "../../fwg.pickdy.pos.common/model/manager/ProductItemModifierManager";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemModifierManager = new ProductItemModifierManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      productItemModifierManager,
      RouteHelper.SEARCH_ACTION,
      "KM_DEFAULT_ROUTE"
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-PRODUCT-MODIFIRER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemsService = new ProductItemsService(httpStatus.entity);
    let productItemModifierList = ProductItemModifierList.newInstance();
    productItemModifierList.assign(req.body);
    productItemsService.insertProductItemModifierList(productItemModifierList)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-POST-PRODUCT-MODIFIRER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ProductItemsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-PRODUCT-MODIFIRER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new ProductItemModifierManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new ProductItemModifier()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-PRODUCT-MODIFIRER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new ProductItemModifierManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new ProductItemModifier()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-PRODUCT-MODIFIRER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// get category by Id
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemModifierManager = new ProductItemModifierManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      productItemModifierManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: productItemModifierManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-PRODUCT-MODIFIRER-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
