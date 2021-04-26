import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import OrdersManager from "../../fwg.pickdy.pos.common/model/manager/OrdersManager";
import Orders from "../../fwg.pickdy.pos.common/model/Orders";
import OrderService from "../services/OrderService";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import WebSocketServer from "../../fwg.pickdy.common/utilities/helpers/WebSocketServer";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    orderService.getOpenOrders()
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-ORDER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    noAccessToRoute(res);
  });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body);
    orderService.insertOrder(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-POST-ORDER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-POST-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});

router.put("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.updateOrder(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-PUT-ORDER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-PUT-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.delete("/", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    RouteHelper.processSecuredRoute(
      req,
      res,
      new OrdersManager(httpStatus.entity),
      RouteHelper.DELETE_ACTION,
      "KM_DEFAULT_ROUTE",
      new Orders()
    );
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-DELETE-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
// get category by Id
router.get("/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    orderService.getOrderDetail(req.params["id"])
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-GET-ORDER-ID ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-GET-ORDER-ID ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/cancelOrder", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.cancelOrder(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-CANCEL-ORDER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-CANCEL-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/cancelBill", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.cancelBill(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTER-CANCEL-BILL ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTER-CANCEL-BILL ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/returnMoneyBill", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.returnMoneyBill(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTE-RETURN-MONEY-BILL ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTE-RETURN-MONEY-BILL ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/checkoutOrder", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.checkoutOrder(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTE-CHECKOUT-ORDER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTE-CHECKOUT-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/mergeOrder", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.mergeOrder(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTE-MERGE-ORDER ' + JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTE-MERGE-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/splitOrder", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.splitOrder(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTE-SPLIT-ORDER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTE-SPLIT-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.get("/getOrderPrinter/:id", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    orderService.getOrderPrinterId(req.params["id"])
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTE-GET-ORDER-PRINTER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTE-GET-ORDER-PRINTER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
router.put("/moveTable", async (req: express.Request, res: express.Response) => {
  AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
    let orderService = new OrderService(httpStatus.entity);
    let order = Orders.newInstance();
    order.assign(req.body.data);
    orderService.moveTable(order)
      .then((httpStatus) => {
        RouteHelper.processResponse(res, httpStatus);
      })
      .catch((err) => {
        PickdyLogHelper.error('ROUTE-MOVE_TABLE-ORDER ' + JSON.stringify(err));
        RouteHelper.processErrorResponse(res, err, new OrdersManager(null));
      });
  }).catch((err) => {
    PickdyLogHelper.error('ROUTE-MOVE_TABLE-ORDER ' + JSON.stringify(err));
    noAccessToRoute(res);
  });
});
export default router;
