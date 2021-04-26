import Orders from "../../fwg.pickdy.pos.common/model/Orders";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import OrdersManager from "../../fwg.pickdy.pos.common/model/manager/OrdersManager";
import User from "../../fwg.pickdy.common/model/User";
import TablesManager from "../../fwg.pickdy.pos.common/model/manager/TableManager";
import Tables from "../../fwg.pickdy.pos.common/model/Tables";
import DepositRules from "../../fwg.pickdy.pos.common/model/DepositRules";
import Constants from "../../fwg.pickdy.pos.common/base/Constants";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import { IsoDateHelper } from "../../fwg.pickdy.common/utilities/helpers/IsoDateHelper";
import DiscountEventRulesManager from "../../fwg.pickdy.pos.common/model/manager/DiscountEventRulesManager";
import DiscountEventRules from "../../fwg.pickdy.pos.common/model/DiscountEventRules";
import WebSocketServer from "../../fwg.pickdy.common/utilities/helpers/WebSocketServer";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class OrderService {
    protected ordersManager: OrdersManager;
    protected tablesManager: TablesManager;
    protected discountEventRulesManager: DiscountEventRulesManager;
    constructor(user: Staffs) {
        this.ordersManager = new OrdersManager(user);
        this.tablesManager = new TablesManager(user);
        this.discountEventRulesManager = new DiscountEventRulesManager(user);
    }
    public insertOrder(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            order.status = Constants.ORDER.OPEN_ORDER;
            order.orderDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
            if (this.ordersManager.user != null) {
                order.staffId = this.ordersManager.user._id;
            }
            if (order.orderType === 'TAKEAWAY') {
                this.tablesManager.search({ 'tableType': 'TAKEAWAY' }).then((httpStatusTables: HttpStatus<Array<Tables>>) => {
                    if (httpStatusTables != null && httpStatusTables.entity.length > 0) {
                        order.table = httpStatusTables.entity[0]._id;
                        this.getMaxOrderNumber(order).then((httpStatusOr: HttpStatus<Orders>) => {
                            order.orderNumber = httpStatusOr.entity.orderNumber;
                            this.ordersManager.create(order).then((httpStatus: HttpStatus<Orders>) => {
                                resolve(httpStatus);
                                WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                            }).catch((err) => {
                                PickdyLogHelper.error('SERVICE-OrderService-insertOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                                reject(HttpStatus.getHttpStatus(err));
                            });
                        });
                    } else {
                        let table: Tables = new Tables();
                        table.tableName = 'TAKEAWAY';
                        table.tableType = 'TAKEAWAY';
                        table.shopId = order.shopId;
                        this.tablesManager.insert(table).then((httpStatusTables: HttpStatus<Tables>) => {
                            order.table = httpStatusTables._id;
                            this.getMaxOrderNumber(order).then((httpStatusOr: HttpStatus<Orders>) => {
                                order.orderNumber = httpStatusOr.entity.orderNumber;
                                this.ordersManager.create(order).then((httpStatus: HttpStatus<Orders>) => {
                                    WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                                    resolve(httpStatus);
                                }).catch((err) => {
                                    PickdyLogHelper.error('SERVICE-OrderService-insertOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                                    reject(HttpStatus.getHttpStatus(err));
                                });
                            });
                        });
                    }
                }).catch((err) => {
                    let table: Tables = new Tables();
                    table.tableName = 'TAKEAWAY';
                    table.tableType = 'TAKEAWAY';
                    table.shopId = order.shopId;
                    this.tablesManager.insert(table).then((httpStatusTables: HttpStatus<Tables>) => {
                        order.table = httpStatusTables._id;
                        this.getMaxOrderNumber(order).then((httpStatusOr: HttpStatus<Orders>) => {
                            this.ordersManager.create(order).then((httpStatus: HttpStatus<Orders>) => {
                                WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                                resolve(httpStatus);
                            }).catch((err) => {
                                PickdyLogHelper.error('SERVICE-OrderService-insertOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                                reject(HttpStatus.getHttpStatus(err));
                            });
                        });
                    }).catch((err) => {
                        reject(HttpStatus.getHttpStatus(err));
                    });
                });
            } else {
                this.getMaxOrderNumber(order).then((httpStatusOr: HttpStatus<Orders>) => {
                    order.orderNumber = httpStatusOr.entity.orderNumber;
                    this.ordersManager.create(order).then((httpStatus: HttpStatus<Orders>) => {
                        WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                        resolve(httpStatus);
                    }).catch((err) => {
                        PickdyLogHelper.error('SERVICE-OrderService-insertOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                        reject(HttpStatus.getHttpStatus(err));
                    });
                });
            }
        });
        return promise;
    }
    public updateOrder(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            order.shops = null;
            order.tableValues = null;
            order.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
            if (this.ordersManager.user != null) {
                order.staffId = this.ordersManager.user._id;
            }
            // UPDATE ORDER            
            this.ordersManager.update({ _id: this.ordersManager.objectID(order._id) }, order).then((httpStatus: HttpStatus<Orders>) => {
                WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                resolve(httpStatus);
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderService-updateOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                reject(HttpStatus.getHttpStatus(err));
            });
        });
        return promise;
    }
    public cancelOrder(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            // check ORDER EXIST
            this.ordersManager.get({ _id: this.ordersManager.objectID(order._id) }).then((ordersGet: HttpStatus<Orders>) => {
                 // UPDATE ORDER
                let orderUpdate = ordersGet.entity;
                if (this.ordersManager.user != null) {
                    orderUpdate.staffId = this.ordersManager.user._id;
                }      
               
                orderUpdate.status = Constants.ORDER.CANCEL_ORDER;
                orderUpdate.comment = order.comment;
                orderUpdate.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                this.ordersManager.update({ _id: this.ordersManager.objectID(orderUpdate._id) }, orderUpdate).then((httpStatus: HttpStatus<Orders>) => {
                    WebSocketServer.SendReloadOrder(orderUpdate, this.ordersManager.user.shopId);
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderService-cancelOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(orderUpdate));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }
    public cancelBill(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            // check ORDER EXIST
            this.ordersManager.get({ _id: this.ordersManager.objectID(order._id) }).then((ordersGet: HttpStatus<Orders>) => {
                 // UPDATE ORDER
                 let orderUpdate = ordersGet.entity;
                if (this.ordersManager.user != null) {
                    orderUpdate.staffId = this.ordersManager.user._id;
                }
                // UPDATE ORDER                
                orderUpdate.status = Constants.ORDER.BILL_CANCEL;
                orderUpdate.comment = order.comment;
                orderUpdate.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                this.ordersManager.update({ _id: this.ordersManager.objectID(orderUpdate._id) }, orderUpdate).then((httpStatus: HttpStatus<Orders>) => {
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderService-cancelBill ' + JSON.stringify(err) + ' --data --' + JSON.stringify(orderUpdate));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }
    public returnMoneyBill(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            // check ORDER EXIST
            this.ordersManager.get({ _id: this.ordersManager.objectID(order._id) }).then((ordersGet: HttpStatus<Orders>) => {
                // UPDATE ORDER
                let orderUpdate = ordersGet.entity;
                orderUpdate.comment = order.comment;
                orderUpdate.moneyReturn = order.moneyReturn;
                orderUpdate.priceOrder = orderUpdate.priceOrder - order.moneyReturn;
                if (orderUpdate.priceOrder < 0) {
                    orderUpdate.priceOrder = 0;
                }
                orderUpdate.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                orderUpdate.tableValues = null;
                orderUpdate.shops = null;
                orderUpdate.discountEventRuleValues = null;
                if (this.ordersManager.user != null) {
                    order.staffId = this.ordersManager.user._id;
                }
                this.ordersManager.update({ _id: this.ordersManager.objectID(orderUpdate._id) }, orderUpdate).then((httpStatus: HttpStatus<Orders>) => {
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderService-returnMoneyBill ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }
    public checkoutOrder(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            this.ordersManager.get({ _id: this.ordersManager.objectID(order._id) }).then((ordersGet: HttpStatus<Orders>) => {
                // UPDATE ORDER
                order = ordersGet.entity;
                order.status = Constants.ORDER.BILL;
                order.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                order.orderDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                if (this.ordersManager.user != null) {
                    order.staffId = this.ordersManager.user._id;
                }
                this.ordersManager.update({ _id: this.ordersManager.objectID(order._id) }, order).then((httpStatus: HttpStatus<Orders>) => {
                    WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderService-checkoutOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }
    public mergeOrder(order: Orders): Promise<HttpStatus<Orders>> {
        let orderMerge: Orders = null;
        let fromOrder: Orders = null;
        let mapDepositRules: Map<string, DepositRules> = new Map<string, DepositRules>();
        let keyDepositRules: string = '';
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            this.ordersManager.get({ _id: this.ordersManager.objectID(order._id) }).then((httpStatus: HttpStatus<Orders>) => {
                orderMerge = httpStatus.entity;
                this.ordersManager.get({ _id: this.ordersManager.objectID(order.toId) }).then((httpStatus: HttpStatus<Orders>) => {
                    fromOrder = httpStatus.entity;
                    if (fromOrder != null) {
                        for (let depositRulestoOrder of orderMerge.depositRules) {
                            keyDepositRules = depositRulestoOrder.productItemId + '-' + depositRulestoOrder.priceOrder;
                            mapDepositRules.set(keyDepositRules, depositRulestoOrder);
                        }
                        for (let depositRulesFromOrder of fromOrder.depositRules) {
                            keyDepositRules = depositRulesFromOrder.productItemId + '-' + depositRulesFromOrder.priceOrder;
                            if (mapDepositRules.has(keyDepositRules)) {
                                let depositRules = mapDepositRules.get(keyDepositRules);
                                depositRules.quantity = depositRules.quantity + depositRulesFromOrder.quantity;
                                mapDepositRules.set(keyDepositRules, depositRules);
                            } else {
                                mapDepositRules.set(keyDepositRules, depositRulesFromOrder);
                            }
                        }
                        orderMerge.depositRules = Array.from(mapDepositRules.values());
                        if (this.ordersManager.user != null) {
                            orderMerge.staffId = this.ordersManager.user._id;
                            fromOrder.staffId = this.ordersManager.user._id;
                        }
                        if (orderMerge.discountEventRules != null && orderMerge.discountEventRules.length > 0) {
                            this.discountEventRulesManager.search(null).then((httpStatus: HttpStatus<Array<DiscountEventRules>>) => {
                                if (httpStatus != null && httpStatus.entity != null && httpStatus.entity.length > 0) {
                                    let disCounts: Array<DiscountEventRules> = new Array<DiscountEventRules>();
                                    for (let discountEventRules of httpStatus.entity) {
                                        for (let discount of orderMerge.discountEventRules) {
                                            if (discountEventRules._id == discount) {
                                                disCounts.push(discountEventRules);
                                            }
                                        }
                                    }
                                    orderMerge.discountEventRuleValues = disCounts;
                                    this.caculateTotalPriceDiscount(orderMerge);
                                    this.ordersManager.update({ _id: this.ordersManager.objectID(orderMerge._id) }, orderMerge).then((httpStatus: HttpStatus<Orders>) => {
                                        fromOrder.status = Constants.ORDER.CANCEL_ORDER;
                                        // CANCEL FROM ORDER
                                        this.ordersManager.update({ _id: this.ordersManager.objectID(fromOrder._id) }, fromOrder);
                                        WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                                        resolve(httpStatus);
                                    }).catch((err) => {
                                        PickdyLogHelper.error('SERVICE-OrderService-mergeOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                                        reject(HttpStatus.getHttpStatus(err));
                                    });
                                }
                            }).catch((err) => {
                                this.caculateTotalPriceDiscount(orderMerge);
                                this.ordersManager.update({ _id: this.ordersManager.objectID(orderMerge._id) }, orderMerge).then((httpStatus: HttpStatus<Orders>) => {
                                    fromOrder.status = Constants.ORDER.CANCEL_ORDER;
                                    // CANCEL FROM ORDER
                                    this.ordersManager.update({ _id: this.ordersManager.objectID(fromOrder._id) }, fromOrder);
                                    WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                                    resolve(httpStatus);
                                }).catch((err) => {
                                    PickdyLogHelper.error('SERVICE-OrderService-mergeOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                                    reject(HttpStatus.getHttpStatus(err));
                                });
                            });
                        } else {
                            this.caculateTotalPriceDiscount(orderMerge);
                            this.ordersManager.update({ _id: this.ordersManager.objectID(orderMerge._id) }, orderMerge).then((httpStatus: HttpStatus<Orders>) => {
                                fromOrder.status = Constants.ORDER.CANCEL_ORDER;
                                // CANCEL FROM ORDER
                                this.ordersManager.update({ _id: this.ordersManager.objectID(fromOrder._id) }, fromOrder);
                                WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                                resolve(httpStatus);
                            }).catch((err) => {
                                PickdyLogHelper.error('SERVICE-OrderService-mergeOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                                reject(HttpStatus.getHttpStatus(err));
                            });
                        }
                        return promise;
                    } else {
                        console.log("-data--" + JSON.stringify(order));
                        reject(new HttpStatus<Orders>(HttpStatus.NO_CONTENT, null));
                    }
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderService-mergeOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(new HttpStatus<Orders>(HttpStatus.NO_CONTENT, null));
                });
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderService-mergeOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                reject(new HttpStatus<Orders>(HttpStatus.NO_CONTENT, null));
            });

        });
        return promise;
    }
    public splitOrder(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            let orderNew = new Orders();
            this.ordersManager.assignObject(orderNew, order);
            orderNew.depositRules = order.toDepositRules;
            orderNew.table = order.table;
            orderNew._id = null;
            orderNew.toDepositRules = null;
            orderNew.shops = null;
            orderNew.tableValues = null;
            if (this.ordersManager.user != null) {
                orderNew.staffId = this.ordersManager.user._id;
            }
            this.caculateTotalPriceDiscount(orderNew);
            orderNew.discountEventRuleValues = null;
            this.insertOrder(orderNew).then((httpStatus: HttpStatus<Orders>) => {
                // caculate deposite split
                let depositRulesRemain: Array<DepositRules> = new Array<DepositRules>();
                for (let depositRule of order.depositRules) {
                    for (let depositRuleSplit of order.toDepositRules) {
                        if (depositRule.productItemId == depositRuleSplit.productItemId && depositRule.priceOrder == depositRuleSplit.priceOrder) {
                            depositRule.quantity = depositRule.quantity - depositRuleSplit.quantity;
                        }
                    }
                    if (depositRule.quantity > 0) {
                        depositRulesRemain.push(depositRule);
                    }
                }
                order.depositRules = depositRulesRemain;
                order.toDepositRules = null;
                order.shops = null;
                order.tableValues = null;
                if (this.ordersManager.user != null) {
                    order.staffId = this.ordersManager.user._id;
                }
                this.caculateTotalPriceDiscount(order);
                orderNew.discountEventRuleValues = null;
                this.updateOrder(order).then((httpStatus: HttpStatus<Orders>) => {
                    this.ordersManager.get({ _id: this.ordersManager.objectID(order._id) }).then((httpStatus: HttpStatus<Orders>) => {
                        WebSocketServer.SendReloadOrder(order, this.ordersManager.user.shopId);
                        resolve(httpStatus);
                    }).catch((err) => {
                        PickdyLogHelper.error('SERVICE-OrderService-splitOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                        reject(HttpStatus.getHttpStatus(err));
                    });
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderService-splitOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                    reject(HttpStatus.getHttpStatus(err));
                });
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderService-splitOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                reject(HttpStatus.getHttpStatus(err));
            });
        });
        return promise;
    }
    /**
     * get getOpenOrders     
     */
    public getOpenOrders(): Promise<HttpStatus<Array<Orders>>> {
        let promise = new Promise<HttpStatus<Array<Orders>>>((resolve, reject) => {
            let pipeList = [];
            pipeList.push({
                $match: {
                    $and: [{
                        'status': 'OPEN'
                    }]
                }
            });
            pipeList.push({ "$addFields": { "tableId": { "$toObjectId": "$table" } } },
                {
                    $lookup:
                    {
                        from: "tables",
                        localField: "tableId",
                        foreignField: "_id",
                        as: "tableValues"
                    }
                },
                {
                    $unwind: {
                        path: "$tableValues"
                    }
                });
            this.ordersManager.classInfo.mongoGetAggregate = pipeList;
            this.ordersManager.search({}).then((httpStatus: HttpStatus<Array<Orders>>) => {
                this.ordersManager.classInfo.mongoGetAggregate = null;
                resolve(httpStatus);
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderService-getOpenOrders ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
                this.ordersManager.classInfo.mongoGetAggregate = null;
                reject(HttpStatus.getHttpStatus(err));
            });
        });
        return promise;
    }
    /**
     * get Order Print      
     */
    public getOrderPrinterId(orderId: string): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            let pipeList: Array<any> = [{
                $match:
                {
                    _id: this.ordersManager.objectID(orderId)
                }
            },
            {
                $lookup:
                {
                    from: "shops",
                    localField: "shopId",
                    foreignField: "_id",
                    as: "shops"
                }
            }
            ];
            this.ordersManager.classInfo.mongoGetAggregate = pipeList;
            this.ordersManager.classInfo.mongoCollectionName = 'orders';
            this.ordersManager.search(null).then((httpStatus: HttpStatus<Array<Orders>>) => {
                this.ordersManager.classInfo.mongoGetAggregate = null;
                if (httpStatus.entity != null && httpStatus.entity.length > 0) {
                    let orders: Orders = httpStatus.entity[0];
                    resolve(new HttpStatus<Orders>(HttpStatus.OK, orders));
                } else {
                    resolve(new HttpStatus<Orders>(HttpStatus.NO_CONTENT, null));
                }
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderService-getOrderPrinterId ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
                this.ordersManager.classInfo.mongoGetAggregate = null;
                reject(HttpStatus.getHttpStatus(err));
            });
        });
        return promise;
    }

    /**
    * get getMaxOrderNUmber     
    */
    public getMaxOrderNumber(order: Orders): Promise<HttpStatus<Orders>> {
        let orderNumber: string = '';
        let pipeList = [];      
        pipeList.push({
            "$group": {
                "_id": "$shopId",
                "orderNumber": { "$max": "$orderNumber" }
            }
        });
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {           
            this.ordersManager.classInfo.mongoGetAggregate = pipeList;           
            let orders: Orders = order;
            this.ordersManager.search({}).then((httpStatus: HttpStatus<Array<Orders>>) => {
                if (httpStatus != null && httpStatus.entity.length > 0) {
                    orders = httpStatus.entity[0];
                    console.log("getMaxOrderNumber1 "+orders.orderNumber);
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
                resolve(new HttpStatus<Orders>(HttpStatus.OK, orders));
            }).catch((err) => {
                this.ordersManager.classInfo.mongoGetAggregate = null;
                orderNumber = '00000001';
                order.orderNumber = orderNumber;
                PickdyLogHelper.error('SERVICE-OrderService-getMaxOrderNumber ' + JSON.stringify(err) + ' --data --' + JSON.stringify(order));
                resolve(new HttpStatus<Orders>(HttpStatus.OK, order));
            });
        });
        return promise;
    }
    /**
     * get getOpenOrders     
     */
    public getOrderDetail(orderId): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            let pipeList = [];
            pipeList.push({
                $match: {
                    $and: [{
                        '_id': this.ordersManager.objectID(orderId)
                    }]
                }
            });
            pipeList.push(
                {
                    $lookup:
                    {
                        from: "shops",
                        localField: "shopId",
                        foreignField: "_id",
                        as: "shops"
                    }
                },
                { "$addFields": { "tableId": { "$toObjectId": "$table" } } },
                {
                    $lookup:
                    {
                        from: "tables",
                        localField: "tableId",
                        foreignField: "_id",
                        as: "tables"
                    }
                },
                { "$addFields": { "staffId": { "$toObjectId": "$staffId" } } },
                {
                    $lookup:
                    {
                        from: "staffs",
                        localField: "staffId",
                        foreignField: "_id",
                        as: "staffs"
                    }
                },
                {
                    $project: {
                        "shops": 1,
                        "tableName": { $ifNull: [{ $arrayElemAt: ["$tables.tableName", 0] }, ""] },
                        "staffName": { $ifNull: [{ $arrayElemAt: ["$staffs.fullName", 0] }, ""] },
                        "orderNumber": 1,
                        "guestId": 1,
                        "comment": 1,
                        "discountEventRules": 1,
                        "orderType": 1,
                        "source": 1,
                        "hasUnreadSMS": 1,
                        "isPaidDeposit": 1,
                        "shopId": 1,
                        "staffId": 1,
                        "priceOrder": 1,
                        "priceDeposit": 1,
                        "createByUserId": 1,
                        "updateByUserId": 1,
                        "createDateTime": 1,
                        "updateDateTime": 1,
                        "serviceFee": 1,
                        "tip": 1,
                        "peopleCount": 1,
                        "deviceOrder": 1,
                        "depositRules": 1,
                        "status": 1,
                        "table": 1,
                        "paymentMethod": 1,
                        "orderDateTime": 1
                    }
                });
            this.ordersManager.classInfo.mongoGetAggregate = pipeList;
            this.ordersManager.search({}).then((httpStatus: HttpStatus<Array<Orders>>) => {
                this.ordersManager.classInfo.mongoGetAggregate = null;
                let httpStatusOrder;
                if (httpStatus != null && httpStatus.entity.length > 0) {
                    httpStatusOrder = new HttpStatus(httpStatus.code, httpStatus.entity[0]);
                } else {
                    httpStatusOrder = new HttpStatus(HttpStatus.NO_CONTENT, null);
                }
                resolve(httpStatusOrder);
            }).catch((err) => {
                PickdyLogHelper.error('SERVICE-OrderService-getOrderDetail ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
                this.ordersManager.classInfo.mongoGetAggregate = null;
                reject(HttpStatus.getHttpStatus(err));
            });
        });
        return promise;
    }

    public moveTable(order: Orders): Promise<HttpStatus<Orders>> {
        let promise = new Promise<HttpStatus<Orders>>((resolve, reject) => {
            this.ordersManager.get({ _id: this.ordersManager.objectID(order._id) }).then((ordersGet: HttpStatus<Orders>) => {
                // moveTable
                let orderMoveTable = ordersGet.entity;
                orderMoveTable.table = order.table;
                orderMoveTable.updateDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                orderMoveTable.orderDateTime = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
                if (this.ordersManager.user != null) {
                    orderMoveTable.staffId = this.ordersManager.user._id;
                }
                this.ordersManager.update({ _id: this.ordersManager.objectID(orderMoveTable._id) }, orderMoveTable).then((httpStatus: HttpStatus<Orders>) => {
                    resolve(httpStatus);
                }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-OrderService-moveTable ' + JSON.stringify(err) + ' --data --' + JSON.stringify(orderMoveTable));
                    reject(HttpStatus.getHttpStatus(err));
                });
            });
        });
        return promise;
    }

    caculateTotalPriceDiscount(order: Orders): void {
        let totalPrice = 0;
        let totalDiscountPrice = 0;
        if (order.depositRules != null && order.depositRules.length > 0) {
            for (let value of order.depositRules) {
                if (value.priceOrder != null && value.priceOrder > 0) {
                    totalPrice = totalPrice + value.priceOrder * value.quantity;
                }
            }
        }
        if (order.discountEventRuleValues != null && order.discountEventRuleValues.length > 0) {
            let eventPercent: number = 0;
            let eventMoney: number = 0;
            for (let discountEvent of order.discountEventRuleValues) {
                if (discountEvent._id != null && discountEvent.eventValue != null && discountEvent.eventValue.trim() != '') {
                    if (discountEvent.eventValue.indexOf('%') > 0) {
                        eventPercent = eventPercent + Number(discountEvent.eventValue.substr(0, (discountEvent.eventValue.indexOf('%'))));
                    } else {
                        eventMoney = eventMoney + Number(discountEvent.eventValue);
                    }
                }
            }
            if (eventPercent > 0) {
                totalDiscountPrice = Math.round(totalPrice * (eventPercent) / 100);
            }
            if (eventMoney > 0) {
                totalDiscountPrice = totalDiscountPrice + Number(eventMoney);
            }
            totalPrice = totalPrice - totalDiscountPrice;
        }
        if (totalPrice < 0) {
            totalPrice = 0;
        }
        order.priceOrder = totalPrice;
    }

}