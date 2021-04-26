import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import CategoriesManager from "../../fwg.pickdy.pos.common/model/manager/CategoriesManager";
import Categories from "../../fwg.pickdy.pos.common/model/Categories";
import CategoryService from "../services/CategoryService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    PickdyLogHelper.info('ROUTER-GET-CATEGORY ' + JSON.stringify(req));
    console.log('ROUTER-GET-CATEGORY ' + JSON.stringify(req));
    let categoryManager = new CategoriesManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      categoryManager,
      RouteHelper.SEARCH_ACTION,
      "KM_DEFAULT_ROUTE"
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-CATEGORY ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.get("/getAllCategoryAndProductItemCount", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let categoryService = new CategoryService(httpStatus.entity);
    categoryService.getAllCategoryAndProductItemCount()
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-getAllCategoryAndProductItemCount ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new CategoriesManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-getAllCategoryAndProductItemCount ' + JSON.stringify(err));
    RouteHelper.processErrorResponse(res, err, new CategoriesManager(null));
  });
});


router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_POST, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new CategoriesManager(httpStatus.entity),
      RouteHelper.INSERT_ACTION,
      "KM_DEFAULT_ROUTE",
      new Categories()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-CATEGORY ' + JSON.stringify(err));
    RouteHelper.processErrorResponse(res, err, new CategoriesManager(null));
  });
});
router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_PUT, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new CategoriesManager(httpStatus.entity),
      RouteHelper.UPDATE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Categories()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-CATEGORY ' + JSON.stringify(err));
    RouteHelper.processErrorResponse(res, err, new CategoriesManager(null));
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_DELETE, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new CategoriesManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Categories()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-CATEGORY ' + JSON.stringify(err));
    RouteHelper.processErrorResponse(res, err, new CategoriesManager(null));
  });
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET_ID, req).then((httpStatus: HttpStatus<Staffs>) => {
    let categoryManager = new CategoriesManager(httpStatus.entity);
    RouteHelper.processSecuredRoute(
      req,
      res,
      categoryManager,
      RouteHelper.GET_ACTION,
      "KM_DEFAULT_ROUTE",
      { _id: categoryManager.objectID(req.params["id"]) }
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-CATEGORY-ID ' + JSON.stringify(err));
    RouteHelper.processErrorResponse(res, err, new CategoriesManager(null));
  });
});

export default router;
