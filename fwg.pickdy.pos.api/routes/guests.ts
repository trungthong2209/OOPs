import * as express from "express";
import RouteHelper from '../../fwg.pickdy.common/utilities/helpers/RouteHelper';
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import GuestsManager from "../../fwg.pickdy.pos.common/model/manager/GuestsManager";
import Guests from "../../fwg.pickdy.pos.common/model/Guests"
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
const router = express.Router();

router.post("/", async(req: express.Request, res: express.Response)=>{
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET,req).then((httpStatus: HttpStatus<Staffs>)=>{
        RouteHelper.processSecuredRoute(req, res, new GuestsManager(httpStatus.entity), req.body.actionType, "KM_DEFAULT_ROUTE", new Guests() )
    }).catch((err) => {
        noAccessToRoute(res);
    });
});

export default router;