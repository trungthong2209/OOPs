import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import ShopsManager from "../../fwg.pickdy.pos.common/model/manager/ShopsManager";
import Shops from "../../fwg.pickdy.pos.common/model/Shops";
import ShopService from "../services/ShopService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let shopService = new ShopService(httpStatus.entity);
    shopService.getAllShops()
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-SHOPS ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ShopsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-SHOPS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let shopService = new ShopService(httpStatus.entity);
    let shop = Shops.newInstance();
    shop.assign(req.body);
    shopService.insertShop(shop)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-POST-SHOPS ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ShopsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-SHOPS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// update category
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new ShopsManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Shops()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-SHOPS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new ShopsManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Shops()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-SHOPS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// get category by Id
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let shopService = new ShopService(httpStatus.entity);
    shopService.getShopById(req.params["id"])
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-SHOPS-ID ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ShopsManager(null));
      });
  }).catch((err) => {
    noAccessToRoute(res);
  });
});
router.put("/genQrCode", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let shopService = new ShopService(httpStatus.entity);
    let shops = Shops.newInstance();
    shops.assign(req.body.data);
    shopService.genQrCode(shops)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GENQRCODE-SHOPS ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new ShopsManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GENQRCODE-SHOPS ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
export default router;
