import * as express from "express";
import RouteHelper from "../../fwg.pickdy.common/utilities/helpers/RouteHelper";
import ReportService from "../services/ReportService";
import OrderSpecialReport from "../../fwg.pickdy.pos.common/model/OrderSpecialReport";
import OrderReportManager from "../../fwg.pickdy.pos.common/model/manager/OrderReportManager";
import OrderProductReportManager from "../../fwg.pickdy.pos.common/model/manager/OrderProductReportManager";
import OrderSpecialReportManager from "../../fwg.pickdy.pos.common/model/manager/OrderSpecialReportManager";
import { IsoDateHelper } from "../../fwg.pickdy.common/utilities/helpers/IsoDateHelper";
import AuthenticationHelper, { noAccessToRoute } from "../utilities/helper/AuthenticationHelper";
import DataAcccessRouter from "../utilities/DataAcccessRouter";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import OrderReportCriterial from "../../fwg.pickdy.pos.common/model/OrderReportCriterial";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";

const router = express.Router();

router.get("/orderSummariesAndChart", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportSummaryAndChart(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderSummariesAndChart-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderSummariesAndChart-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderPaymentsAndChart", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportPaymentAndChart(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderPaymentsAndChart-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderPaymentsAndChart-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderStaffAndChart", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportStaffAndChart(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderStaffAndChart-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderStaffAndChart-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderStaffDetail", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportStaffDetail(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderStaffDetail-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderStaffDetail-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderTaxServiceFeeAndChart", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportTaxAndServiceFeeAndChart(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderTaxServiceFeeAndChart-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderTaxServiceFeeAndChart-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderProductCategoryAndChart", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportProductCategoryAndChart(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderProductCategoryAndChart-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderProductReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderProductCategoryAndChart-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderProductItemAndChart", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportProductItemAndChart(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderProductItemAndChart-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderProductReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderProductItemAndChart-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderInStore", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        let orderSpecialReport: OrderSpecialReport = JSON.parse(queryStringSearch);
        if (orderSpecialReport.searchCriterial.statusList == null || orderSpecialReport.searchCriterial.statusList.length == 0) {
            let statusList = new Array<string>();
            statusList.push('BILL');
            statusList.push('BILL_CANCEL');
            orderSpecialReport.searchCriterial.statusList = statusList;
        }
        if (orderSpecialReport.searchCriterial.fromDate == null || orderSpecialReport.searchCriterial.fromDate.trim() == '') {
            orderSpecialReport.searchCriterial.fromDate = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh').toISOString().substring(0, 10);
        }
        reportService.getOrderInStore(orderSpecialReport).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderInStore-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderSpecialReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderInStore-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderBillCancel", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        let orderSpecialReport: OrderSpecialReport = JSON.parse(queryStringSearch);
        orderSpecialReport.searchCriterial.status = 'BILL_CANCEL';
        reportService.getOrderInStore(orderSpecialReport).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderBillCancel-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderSpecialReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderBillCancel-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderCancel", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        let orderSpecialReport: OrderSpecialReport = JSON.parse(queryStringSearch);
        orderSpecialReport.searchCriterial.status = 'CANCEL';
        reportService.getOrderInStore(orderSpecialReport).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderCancel-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderSpecialReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderCancel-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/orderItemCancel", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getOrderProductItemCancel(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-orderItemCancel-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderSpecialReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-orderItemCancel-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/currentOrders", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        reportService.getReportDayRevenue().then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-currentOrders-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-currentOrders-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/currentBills", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let orderReportCriterial: OrderReportCriterial = new OrderReportCriterial();
        orderReportCriterial.status = 'BILL';
        orderReportCriterial.fromDate = new Date().toISOString().slice(0, 10);
        reportService.getTotalOrder(orderReportCriterial).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-currentBills-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-currentBills-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/currentWeekOrders", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        reportService.getReport7DayRevenue().then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-currentWeekOrders-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-currentWeekOrders-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/reportInventory", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        let queryStringSearch = req.query["search"];
        reportService.getReportInventory(JSON.parse(queryStringSearch)).then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-reportInventory-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-reportInventory-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
router.get("/currentOrdersDetail", async (req: express.Request, res: express.Response) => {
    AuthenticationHelper.checkAccess(DataAcccessRouter.CATEGORY.FWG_POS_CATEGORY_GET, req).then((httpStatus: HttpStatus<Staffs>) => {
        let reportService = new ReportService(httpStatus.entity);
        reportService.getReportCurrentOrdersDetail().then((httpStatus) => {
            RouteHelper.processResponse(res, httpStatus);
        }).catch((err) => {
            PickdyLogHelper.error('ROUTER-currentOrdersDetail-REPORT ' + JSON.stringify(err));
            RouteHelper.processErrorResponse(res, err, new OrderReportManager(null));
        });
    }).catch((err) => {
        PickdyLogHelper.error('ROUTER-currentOrdersDetail-REPORT ' + JSON.stringify(err));
        noAccessToRoute(res);
    });
});
export default router;