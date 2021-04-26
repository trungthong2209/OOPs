import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import OrdersTakeAwayManager from "../../fwg.pickdy.pos.common/model/manager/OrdersTakeAwayManager";
import OrdersTakeAway from "../../fwg.pickdy.pos.common/model/OrdersTakeAway";
import OrderTakeawayService from "../services/OrderTakeawayService";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  let orderService = new OrderTakeawayService(null);
  orderService.getOpenOrders()
    .then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    }).catch((err) => {
      PickdyLogHelper.error('ROUTER-GET-ORDER_TAKEAWAY ' + JSON.stringify(err));
      RouteHelper.processErrorResponse(res, err, new OrdersTakeAwayManager(null));
    });
}
);

router.post("/", async (req: express.Request, res: express.Response) => {
  let orderService = new OrderTakeawayService(null);
  let order = OrdersTakeAway.newInstance();
  order.assign(req.body);
  orderService.insertOrder(order)
    .then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    })
    .catch((err) => {
      PickdyLogHelper.error('ROUTER-POST-ORDER_TAKEAWAY ' + JSON.stringify(err))
      RouteHelper.processErrorResponse(res, err, new OrdersTakeAwayManager(null));
    });
}
);

router.put("/", async (req: express.Request, res: express.Response) => {
  let orderService = new OrderTakeawayService(null);
  let order = OrdersTakeAway.newInstance();
  order.assign(req.body.data);
  orderService.updateOrder(order)
    .then((httpStatus) => {
      RouteHelper.processResponse(res, httpStatus);
    })
    .catch((err) => {
      PickdyLogHelper.error('ROUTER-PUT-ORDER_TAKEAWAY ' + JSON.stringify(err))
      RouteHelper.processErrorResponse(res, err, new OrdersTakeAwayManager(null));
    });
}
);
router.delete("/", async (req: express.Request, res: express.Response) => {
  RouteHelper.processSecuredRoute(
    req,
    res,
    new OrdersTakeAwayManager(null),
    RouteHelper.DELETE_ACTION,
    "KM_DEFAULT_ROUTE",
    new OrdersTakeAway()
  );
});

export default router;
