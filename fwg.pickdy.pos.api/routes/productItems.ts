import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import ProductItemsService from "../services/ProductItemsService";
import ProductItemsManager from "../../fwg.pickdy.pos.common/model/manager/ProductItemsManager";
import ProductItems from "../../fwg.pickdy.pos.common/model/ProductItems";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();

router.get("/getAllProductModifier", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemsService = new ProductItemsService(httpStatus.entity);
    productItemsService.getAllProductModifier()
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-PRODUCTMODIFIRER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ProductItemsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-PRODUCTMODIFIRER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemsService = new ProductItemsService(httpStatus.entity);
    productItemsService.getProductItems()
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      }).catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-PRODUCTITEM ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ProductItemsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-PRODUCTITEM ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemsService = new ProductItemsService(httpStatus.entity);
    let productItems = ProductItems.newInstance();
    productItems.assign(req.body);
    productItemsService.insertProductItem(productItems).then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-POST-PRODUCTITEM ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ProductItemsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-PRODUCTITEM ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// update category
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemsService = new ProductItemsService(httpStatus.entity);
    let productItemsManager: ProductItemsManager = new ProductItemsManager(null);
    let productItems = ProductItems.newInstance();
    productItems.assign(req.body.data);
    if (req.body.criteria._id) {
      req.body.criteria._id = productItemsManager.objectID(req.body.criteria._id);
    }
    productItemsService.updateProductItem(productItems).then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-PUT-PRODUCTITEM ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, productItemsManager);
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-PRODUCTITEM ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new ProductItemsManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new ProductItems()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-PRODUCTITEM ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// get category by Id
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let productItemsManager = new ProductItemsManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      productItemsManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: productItemsManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-PRODUCTITEM-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

export default router;
