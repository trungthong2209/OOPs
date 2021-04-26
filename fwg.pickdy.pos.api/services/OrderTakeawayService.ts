import OrdersTakeAway from "../../fwg.pickdy.pos.common/model/OrdersTakeAway";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import OrdersTakeAwayManager from "../../fwg.pickdy.pos.common/model/manager/OrdersTakeAwayManager";
import Constants from "../../fwg.pickdy.pos.common/base/Constants";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import { IsoDateHelper } from "../../fwg.pickdy.common/utilities/helpers/IsoDateHelper";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class OrderTakeawayService {
    protected ordersTakeAwayManager: OrdersTakeAwayManager;
    constructor(user: Staffs) {
        this.ordersTakeAwayManager = new OrdersTakeAwayManager(user);
    }
    public insertOrder(order: OrdersTakeAway): Promise<HttpStatus<OrdersTakeAway>> {
        let promise = new Promise<HttpStatus<OrdersTakeAway>>((resolve, reject) => {
            order.status = Constants.ORDER.OPEN_ORDER;
            order.orderDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
            this.getMaxOrderNumber(order).then((httpStatusOr: HttpStatus<OrdersTakeAway>) => {
                order.orderNumber = httpStatusOr.entity.orderNumber;
                this.ordersTakeAwayManager.create(order).then((httpStatus: HttpStatus<OrdersTakeAway>) => {
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderTakeawayService-insertOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }
    public updateOrder(order: OrdersTakeAway): Promise<HttpStatus<OrdersTakeAway>> {
        let promise = new Promise<HttpStatus<OrdersTakeAway>>((resolve, reject) => {
            order.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
            // UPDATE ORDER            
            this.ordersTakeAwayManager.update({ _id: this.ordersTakeAwayManager.objectID(order._id) }, order).then((httpStatus: HttpStatus<OrdersTakeAway>) => {
                resolve(httpStatus);
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderTakeawayService-updateOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                reject(HttpStatus.getHttpStatus(err));
            });
        });
        return promise;
    }
    public cancelOrder(order: OrdersTakeAway): Promise<HttpStatus<OrdersTakeAway>> {
        let promise = new Promise<HttpStatus<OrdersTakeAway>>((resolve, reject) => {
            // check ORDER EXIST
            this.ordersTakeAwayManager.get({ _id: this.ordersTakeAwayManager.objectID(order._id) }).then((ordersGet: HttpStatus<OrdersTakeAway>) => {
                // UPDATE ORDER
                order = ordersGet.entity;
                order.status = Constants.ORDER.CANCEL_ORDER;
                order.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                this.ordersTakeAwayManager.update({ _id: this.ordersTakeAwayManager.objectID(order._id) }, order).then((httpStatus: HttpStatus<OrdersTakeAway>) => {
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderTakeawayService-cancelOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }
    public cancelBill(order: OrdersTakeAway): Promise<HttpStatus<OrdersTakeAway>> {
        let promise = new Promise<HttpStatus<OrdersTakeAway>>((resolve, reject) => {
            // check ORDER EXIST
            this.ordersTakeAwayManager.get({ _id: this.ordersTakeAwayManager.objectID(order._id) }).then((ordersGet: HttpStatus<OrdersTakeAway>) => {
                // UPDATE ORDER
                order = ordersGet.entity;
                order.status = Constants.ORDER.BILL_CANCEL;
                order.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                this.ordersTakeAwayManager.update({ _id: this.ordersTakeAwayManager.objectID(order._id) }, order).then((httpStatus: HttpStatus<OrdersTakeAway>) => {
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderTakeawayService-cancelBill ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }
    public checkoutOrder(order: OrdersTakeAway): Promise<HttpStatus<OrdersTakeAway>> {
        let promise = new Promise<HttpStatus<OrdersTakeAway>>((resolve, reject) => {
            this.ordersTakeAwayManager.get({ _id: this.ordersTakeAwayManager.objectID(order._id) }).then((ordersGet: HttpStatus<OrdersTakeAway>) => {
                // UPDATE ORDER
                order = ordersGet.entity;
                order.status = Constants.ORDER.BILL;
                order.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                order.orderDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                this.ordersTakeAwayManager.update({ _id: this.ordersTakeAwayManager.objectID(order._id) }, order).then((httpStatus: HttpStatus<OrdersTakeAway>) => {
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderTakeawayService-checkoutOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }

    /**
     * get getOpenOrders     
     */
    public getOpenOrders(): Promise<HttpStatus<Array<OrdersTakeAway>>> {
        let promise = new Promise<HttpStatus<Array<OrdersTakeAway>>>((resolve, reject) => {
            let pipeList = [];
            pipeList.push({
                $match: {
                    $and: [{
                        'status': 'OPEN'
                    }]
                }
            });
            this.ordersTakeAwayManager.classInfo.mongoGetAggregate = pipeList;
            this.ordersTakeAwayManager.search({}).then((httpStatus: HttpStatus<Array<OrdersTakeAway>>) => {
                this.ordersTakeAwayManager.classInfo.mongoGetAggregate = null;
                resolve(httpStatus);
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderTakeawayService-getOpenOrders ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
                this.ordersTakeAwayManager.classInfo.mongoGetAggregate = null;
                reject(HttpStatus.getHttpStatus(err));
            });
        });
        return promise;
    }


    /**
    * get getMaxOrderNUmber     
    */
    public getMaxOrderNumber(order: OrdersTakeAway): Promise<HttpStatus<OrdersTakeAway>> {
        let orderNumber: string = '';
        let pipeList = [];
        pipeList.push({
            $match: {
                $and: [{
                    'shopId': this.ordersTakeAwayManager.objectID(order.shopId)
                }]
            }
        });
        pipeList.push({
            "$group": {
                "_id": "$shopId",
                "orderNumber": { "$max": "$orderNumber" }
            }
        });
        let promise = new Promise<HttpStatus<OrdersTakeAway>>((resolve, reject) => {
            this.ordersTakeAwayManager.classInfo.mongoGetAggregate = pipeList;
            let orders: OrdersTakeAway = order;
            this.ordersTakeAwayManager.search({}).then((httpStatus: HttpStatus<Array<OrdersTakeAway>>) => {
                if (httpStatus != null && httpStatus.entity.length > 0) {
                    orders = httpStatus.entity[0];
                    let ordNumber = Number(orders.orderNumber);
                    if (ordNumber == 99999999) {
                        orderNumber = '00000001';
                    } else {
                        ordNumber = ordNumber + 1;
                        let zeroAddLength = 8 - ordNumber.toString().length;
                        if (zeroAddLength > 0) {
                            let zeroAd = '';
                            for (let index = 0; index < zeroAddLength; index++) {
                                zeroAd = zeroAd.concat('0');
                            }
                            orderNumber = zeroAd.concat(ordNumber.toString());
                        }
                    }
                    orders.orderNumber = orderNumber;
                }
                resolve(new HttpStatus<OrdersTakeAway>(HttpStatus.OK, orders));
            }).catch((err) => {
                this.ordersTakeAwayManager.classInfo.mongoGetAggregate = null;
                orderNumber = '00000001';
                order.orderNumber = orderNumber;
                PickdyLogHelper.error('SERVICE-OrderTakeawayService-getMaxOrderNumber ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                resolve(new HttpStatus<OrdersTakeAway>(HttpStatus.OK, order));
            });
        });
        return promise;
    }


}