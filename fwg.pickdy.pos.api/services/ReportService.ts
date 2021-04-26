import OrderReportManager from "../../fwg.pickdy.pos.common/model/manager/OrderReportManager";
import OrderProductReportManager from "../../fwg.pickdy.pos.common/model/manager/OrderProductReportManager";
import OrderSpecialReportManager from "../../fwg.pickdy.pos.common/model/manager/OrderSpecialReportManager";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import { IsoDateHelper } from "../../fwg.pickdy.common/utilities/helpers/IsoDateHelper";
import OrderReport from "../../fwg.pickdy.pos.common/model/OrderReport";
import OrderReportCriterial from "../../fwg.pickdy.pos.common/model/OrderReportCriterial";
import OrderProductReport from "../../fwg.pickdy.pos.common/model/OrderProductReport";
import OrderSpecialReport from "../../fwg.pickdy.pos.common/model/OrderSpecialReport";
import RawMaterialsReport from "../../fwg.pickdy.pos.common/model/RawMaterialsReport";
import RawMaterialService from "./RawMaterialService";
import RawMaterials from "../../fwg.pickdy.pos.common/model/RawMaterials";
import RawMaterialinputService from "./RawMaterialinputService";
import RawMaterialInput from "../../fwg.pickdy.pos.common/model/RawMaterialInputs";
import RawMaterialsReportInOut from "../../fwg.pickdy.pos.common/model/RawMaterialsReportInOut";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class ReportService {
  protected orderReportManager: OrderReportManager;
  protected orderProductReportManager: OrderProductReportManager;
  protected orderSpecialReportManager: OrderSpecialReportManager;
  constructor(user: Staffs) {
    this.orderReportManager = new OrderReportManager(user);
    this.orderProductReportManager = new OrderProductReportManager(user);
    this.orderSpecialReportManager = new OrderSpecialReportManager(user);
  }
  /**
   * getReportSummaryAndChart     
   */
  public getReportSummaryAndChart(orderReportParam: OrderReport): Promise<HttpStatus<OrderReport[]>> {
    let promise = new Promise<HttpStatus<OrderReport[]>>((resolve, reject) => {
      this.getRevenueChartByHourse(orderReportParam).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportSummary: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.chartData != null && orderReport.chartData.length > 0) {
            orderReportSummary.chartData.push(orderReport.chartData[0]);
          }
        }
        this.getOrderByDate(orderReportParam).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
          for (let orderReport of httpStatus.entity) {
            if (orderReport.summaries != null && orderReport.summaries.length > 0) {
              orderReportSummary.summaries.push(orderReport.summaries[0]);
            }
          }
          orderReportSummary.searchCriterial = orderReportParam.searchCriterial;
          let orderReportSummaryArr = new Array<OrderReport>();
          orderReportSummaryArr.push(orderReportSummary);
          let httpStatusInvoiceReport = new HttpStatus(httpStatus.code, orderReportSummaryArr);
          resolve(httpStatusInvoiceReport);
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-ReportService-getReportSummaryAndChart ' + JSON.stringify(err) + ' --data --' + JSON.stringify(orderReportParam));
          resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
        });
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-ReportService-getReportSummaryAndChart ' + JSON.stringify(err) + ' --data --' + JSON.stringify(orderReportParam));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
    * getReportPaymentAndChart      
    */
  public getReportPaymentAndChart(invoiceReportParam: OrderReport): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(invoiceReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $group: {
          _id: "$paymentMethod",
          price: { $sum: "$priceOrder" }, "orderCount": { $sum: 1 }
        }
      }, {
        $project: {
          "chartData": [{
            "name": "$_id",
            "value": "$price"
          }],
          "payments": [{
            "pamentType": "$_id",
            "price": "$price",
            "orderCount": "$orderCount"
          }]
        }
      }, {
        '$sort': {
          'paymentMethod': 1
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportPayment: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.chartData != null && orderReport.chartData.length > 0) {
            orderReportPayment.chartData.push(orderReport.chartData[0]);
          }
          if (orderReport.payments != null && orderReport.payments.length > 0) {
            orderReportPayment.payments.push(orderReport.payments[0]);
          }
        }
        orderReportPayment.searchCriterial = invoiceReportParam.searchCriterial;
        let orderReportPaymentArr = new Array<OrderReport>();
        orderReportPaymentArr.push(orderReportPayment);
        let httpStatusReportPayment = new HttpStatus(httpStatus.code, orderReportPaymentArr);
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusReportPayment);
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-ReportService-getReportPaymentAndChart ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }

  /**
   * getReportStaffAndChart      
   */
  public getReportStaffAndChart(orderReportParam: OrderReport): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $group: {
          _id: "$staffId",
          price: { $sum: "$priceOrder" },
          invoiceCount: { $sum: 1 }
        }
      }, {
        $lookup: {
          let: { "staffObjId": { "$toObjectId": "$_id" } },
          from: "staffs",
          "pipeline": [
            { "$match": { "$expr": { "$eq": ["$_id", "$$staffObjId"] } } }
          ],
          as: "staff"
        }
      }, {
        $project: {
          "chartData": [{
            "name": { $ifNull: [{ $arrayElemAt: ["$staff.fullName", 0] }, "0"] },
            "value": "$price"
          }],
          "staffs": [{
            "staffId": { $ifNull: [{ $arrayElemAt: ["$staff._id", 0] }, "0"] },
            "staffName": { $ifNull: [{ $arrayElemAt: ["$staff.fullName", 0] }, "0"] },
            "price": "$price",
            "orderCount": "$invoiceCount"
          }]
        }
      }, {
        '$sort': {
          'name': 1
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportStaff: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.chartData != null && orderReport.chartData.length > 0) {
            orderReportStaff.chartData.push(orderReport.chartData[0]);
          }
          if (orderReport.staffs != null && orderReport.staffs.length > 0) {
            orderReportStaff.staffs.push(orderReport.staffs[0]);
          }
        }
        orderReportStaff.searchCriterial = orderReportParam.searchCriterial;
        let orderReportStaffArr = new Array<OrderReport>();
        orderReportStaffArr.push(orderReportStaff);
        let httpStatusOrderReportStaff = new HttpStatus(httpStatus.code, orderReportStaffArr);
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusOrderReportStaff);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportStaffAndChart ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
   * getReportStaffAndChart      
   */
  public getReportStaffDetail(orderReportParam: OrderReport): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $unwind: {
          path: "$depositRules"
        }
      }, {
        "$group":
        {
          "_id": {
            "_id": "$_id",
            "orderType": "$orderType",
            "price": "$priceOrder",
            "staffId": "$staffId",
            "orderNumber": "$orderNumber",
            "orderDateTime": "$orderDateTime"
          },
          "quantity": { "$sum": "$depositRules.quantity" }
        }
      }, {
        $project: {
          "_id": "$_id._id",
          "staffDetails": [{
            "quantity": "$quantity",
            "price": "$_id.price",
            "orderNumber": "$_id.orderNumber",
            "orderType": "$_id.orderType",
            "staffId": "$_id.staffId",            
            "orderDateTime": { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$_id.orderDateTime" } }
          }]
        }
      });      
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportStaff: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.staffDetails != null && orderReport.staffDetails.length > 0) {
            orderReportStaff.staffDetails.push(orderReport.staffDetails[0]);
          }
        }
        orderReportStaff.searchCriterial = orderReportParam.searchCriterial;
        let orderReportStaffArr = new Array<OrderReport>();
        orderReportStaffArr.push(orderReportStaff);
        let httpStatusOrderReportStaff = new HttpStatus(httpStatus.code, orderReportStaffArr);
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusOrderReportStaff);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportStaffDetail ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
    * getReportTaxAndServiceFeeAndChart      
  */
  public getReportTaxAndServiceFeeAndChart(orderReportParam: OrderReport): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({ "$addFields": { "staffIdIdObj": { "$toObjectId": "$staffId" } } },
        {
          $lookup:
          {
            from: "staffs",
            localField: "staffIdIdObj",
            foreignField: "_id",
            as: "staffs"
          }
        }, {
        $project: {
          "taxServiceFees": [{
            "orderTime": { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$orderDateTime" } },
            "orderMoney": "$priceOrder",
            "taxMoney": { $add: ["$priceOrder", "$tax"] },
            "serviceFeeMoney": { $add: ["$priceOrder", "$serviceFee"] },
            "discountMonney": { $subtract: ["$priceOrder", "$discount"] },
            "staffName": { $ifNull: [{ $arrayElemAt: ["$staffs.fullName", 0] }, ""] }
          }]
        }
      }, {
        '$sort': {
          'orderDateTime': 1
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportTaxServiceFees: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.taxServiceFees != null && orderReport.taxServiceFees.length > 0) {
            orderReportTaxServiceFees.taxServiceFees.push(orderReport.taxServiceFees[0]);
          }
        }
        orderReportTaxServiceFees.searchCriterial = orderReportParam.searchCriterial;
        let orderReportTaxServiceFeesArr = new Array<OrderReport>();
        orderReportTaxServiceFeesArr.push(orderReportTaxServiceFees);
        let httpStatusOrderReportTaxServiceFeesArr = new HttpStatus(httpStatus.code, orderReportTaxServiceFeesArr);
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusOrderReportTaxServiceFeesArr);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportTaxAndServiceFeeAndChart ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
   * getReportProductCategory      
  */
  public getReportProductCategoryAndChart(orderProductReporParam: OrderProductReport): Promise<HttpStatus<Array<OrderProductReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderProductReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderProductReporParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $unwind: {
          path: "$depositRules"
        }
      },
        { "$addFields": { "productItemIdObj": { "$toObjectId": "$depositRules.productItemId" } } },
        {
          $lookup: {
            from: "productItems",
            localField: "productItemIdObj",
            foreignField: "_id",
            as: "productItems"
          }
        }, {
        $unwind: {
          path: "$productItems"
        }
      }, {
        $project: {
          "productItemId": "$depositRules.productItemId",
          "categories": "$productItems.categories",
          "priceOrder": "$depositRules.priceOrder",
          "cancel": "$depositRules.cancel",
          "quantity": "$depositRules.quantity",
        }
      }, {
        $match: {
          "cancel": false
        }
      }, {
        "$addFields": { "categoriesIdObj": { "$toObjectId": "$categories" } }
      }, {
        $lookup: {
          from: "categories",
          localField: "categoriesIdObj",
          foreignField: "_id",
          as: "categories"
        }
      }, {
        $unwind: {
          path: "$categories"
        }
      }, {
        $project: {
          "productItemId": "$productItemId",
          "categories": "$categories.categoryName",
          "priceOrder": "$priceOrder",
          "quantity": "$quantity"
        }
      }, {
        $group: {
          _id: "$categories",
          price: { $sum: { $multiply: ["$priceOrder", "$quantity"] } },
          invoiceCount: { $sum: "$quantity" }
        }
      }, {
        $project: {
          "chartData": [{
            "name": "$_id",
            "value": "$price"
          }],
          "categories": [{
            "categoryName": "$_id",
            "price": "$price",
            "categoryCount": "$invoiceCount"
          }]
        }
      });
      this.orderProductReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderProductReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderProductReport>>) => {
        let productReportCategory: OrderProductReport = new OrderProductReport();
        for (let productReport of httpStatus.entity) {
          if (productReport.chartData != null && productReport.chartData.length > 0) {
            productReportCategory.chartData.push(productReport.chartData[0]);
          }
          if (productReport.categories != null && productReport.categories.length > 0) {
            productReportCategory.categories.push(productReport.categories[0]);
          }
        }
        productReportCategory.searchCriterial = orderProductReporParam.searchCriterial;
        let productReportCategoryArr = new Array<OrderProductReport>();
        productReportCategoryArr.push(productReportCategory);
        let httpStatusProductReportCategory = new HttpStatus(httpStatus.code, productReportCategoryArr);
        this.orderProductReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusProductReportCategory);
      }).catch((err) => {
        this.orderProductReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportProductCategoryAndChart ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderProductReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
    * getReportProductItem      
  */
  public getReportProductItemAndChart(productReportParam: OrderProductReport): Promise<HttpStatus<Array<OrderProductReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderProductReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(productReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $unwind: {
          path: "$depositRules"
        }
      },
        { "$addFields": { "productItemIdObj": { "$toObjectId": "$depositRules.productItemId" } } },
        {
          $lookup: {
            from: "productItems",
            localField: "productItemIdObj",
            foreignField: "_id",
            as: "productItems"
          }
        }, {
        $unwind: {
          path: "$productItems"
        }
      }, {
        $project: {
          "productItemId": "$depositRules.productItemId",
          "categories": "$productItems.categories",
          "priceOrder": "$depositRules.priceOrder",
          "priceOrigin": "$productItems.priceDefault",
          "quantity": "$depositRules.quantity",
          "productName": "$productItems.productName",
          "cancel": "$depositRules.cancel"
        }
      }, {
        $match: {
          "cancel": false
        }
      }, {
        "$addFields": { "categoriesIdObj": { "$toObjectId": "$categories" } }
      }, {
        $lookup: {
          from: "categories",
          localField: "categoriesIdObj",
          foreignField: "_id",
          as: "categories"
        }
      }, {
        $unwind: {
          path: "$categories"
        }
      }, {
        $project: {
          "productItemId": "$productItemId",
          "productName": "$productName",
          "categories": "$categories.categoryName",
          "priceOrder": "$priceOrder",
          "priceOrigin": "$priceOrigin",
          "quantity": "$quantity"
        }
      }, {
        $group: {
          "_id": {
            "productItemId": "$productItemId",
            "productName": "$productName",
            "categories": "$categories",
            "priceOrigin": "$priceOrigin",
          },
          quantity: { $sum: "$quantity" },
          totalPrice: { $sum: { $multiply: ["$priceOrder", "$quantity"] } }
        }
      }, {
        $project: {
          "_id": "$_id.productItemId",
          "chartData": [{
            "name": "$_id.productName",
            "value": "$totalPrice"
          }],
          "productItems": [{
            "productName": "$_id.productName",
            "categoryName": "$_id.categories",
            "priceItem": "$_id.priceOrigin",
            "incomeMoney": "$totalPrice",
            "quantity": "$quantity"
          }]
        }
      }
      );
      this.orderProductReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderProductReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderProductReport>>) => {
        let productReportProductItem: OrderProductReport = new OrderProductReport();
        for (let productReport of httpStatus.entity) {
          if (productReport.chartData != null && productReport.chartData.length > 0) {
            productReportProductItem.chartData.push(productReport.chartData[0]);
          }
          if (productReport.productItems != null && productReport.productItems.length > 0) {
            productReportProductItem.productItems.push(productReport.productItems[0]);
          }
        }
        productReportProductItem.searchCriterial = productReportParam.searchCriterial;
        let productReportProductItemArr = new Array<OrderProductReport>();
        productReportProductItemArr.push(productReportProductItem);
        let httpStatusProductReportProductItem = new HttpStatus(httpStatus.code, productReportProductItemArr);
        this.orderProductReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusProductReportProductItem);
      }).catch((err) => {
        this.orderProductReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportProductItemAndChart ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderProductReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
    * getRevenueChartByHourse      
  */
  private getRevenueChartByHourse(orderReportParam: OrderReport): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $group: {
          _id: { $hour: "$orderDateTime" },
          price: { $sum: "$priceOrder" }
        }
      }, {
        $project: {
          "chartData": [{
            "name": "$_id",
            "value": "$price"
          }]
        }
      }, {
        '$sort': {
          '_id': 1
        }
      }
      );
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getRevenueChartByHourse ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }

  /**
    * get all Categories and Product Items Counts      
  */
  public getOrderByDate(orderReportParam: OrderReport): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $group: {
          "_id": { $dateToString: { format: "%d/%m/%Y", date: "$orderDateTime" } }, "totalPrice": { "$sum": "$priceOrder" }, "count": { $sum: 1 },
          "tax": { $sum: "$tax" }, "tip": { "$sum": "$tip" },
          "serviceFee": { $sum: "$serviceFee" }, "discount": { "$sum": "$discount" }
        }
      }, {
        $project: {
          "summaries": [{
            "orderDate": "$_id",
            "orderCount": "$count",
            "totalMoney": "$totalPrice",
            "avgIncomePerInv": { $divide: ["$totalPrice", "$count"] },
            "taxMoney": "$tax",
            "incomeMoney": "$priceOrder",
            "tipMoney": "$tip",
            "discountMoney": "$discount",
            "serviceMoney": "$serviceFee"
          }]
        }
      }, {
        '$sort': {
          '_id': 1
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getOrderByDate ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
    * get all Categories and Product Items Counts      
  */
  public getOrderInStore(orderSpecialReportParam: OrderSpecialReport): Promise<HttpStatus<Array<OrderSpecialReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderSpecialReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderSpecialReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({ "$addFields": { "staffIdIdObj": { "$toObjectId": "$staffId" } } },
        {
          $lookup:
          {
            from: "staffs",
            localField: "staffIdIdObj",
            foreignField: "_id",
            as: "staffs"
          }
        },  
            { "$addFields": { "tableID": { "$toObjectId": "$table" } } },
        {
          $lookup:
          {
            from: "tables",
            localField: "tableID",
            foreignField: "_id",
            as: "tables"
          }
        },
        {
          $project: {
            "_id": "$orderDateTime",
            "orders": [{
              "orderId": "$_id",
              "orderTime": { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$orderDateTime" } },
              "price": "$priceOrder",
              "staffName": { $ifNull: [{ $arrayElemAt: ["$staffs.fullName", 0] }, ""] },
              "paymenType": "$paymentMethod",
              "serviceType": "$orderType",
              "reason": "$comment",
              "status": "$status",
              "orderNumber": "$orderNumber",
              "lastUpdateTime": { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$updateDateTime" } },
              "tableName" : "$tables.tableName"
            }]
          }
        }, {
        '$sort': {
          '_id': -1
        }
      });      
      this.orderSpecialReportManager.classInfo.mongoGetAggregate = pipeList;      
      this.orderSpecialReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderSpecialReport>>) => {
        let orderSpecialReportOrders: OrderSpecialReport = new OrderSpecialReport();
        for (let orderSpecialReport of httpStatus.entity) {
          if (orderSpecialReport.orders != null && orderSpecialReport.orders.length > 0) {
            orderSpecialReportOrders.orders.push(orderSpecialReport.orders[0]);
          }
        }
        orderSpecialReportOrders.searchCriterial = orderSpecialReportParam.searchCriterial;
        let orderSpecialReportOrdersArr = new Array<OrderSpecialReport>();
        orderSpecialReportOrdersArr.push(orderSpecialReportOrders);
        let httpStatusOrderSpecialReportOrders = new HttpStatus(httpStatus.code, orderSpecialReportOrdersArr);
        this.orderSpecialReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusOrderSpecialReportOrders);
      }).catch((err) => {
        this.orderSpecialReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getOrderInStore ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderSpecialReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  
  /**
    * get all Categories and Product Items Counts      
  */
  public getOrderProductItemCancel(orderSpecialReportParam: OrderSpecialReport): Promise<HttpStatus<Array<OrderSpecialReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderSpecialReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderSpecialReportParam.searchCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $unwind: {
          path: "$depositRules"
        }
      },
        { "$addFields": { "productItemIdObj": { "$toObjectId": "$depositRules.productItemId" } } },
        {
          $lookup:
          {
            from: "productItems",
            localField: "productItemIdObj",
            foreignField: "_id",
            as: "productItems"
          }
        }, {
        $unwind: {
          path: "$productItems"
        }
      }, {
        $project: {
          "productItemId": "$depositRules.productItemId",
          "priceOrder": "$depositRules.priceOrder",
          "priceOrigin": "$productItems.priceDefault",
          "quantity": "$depositRules.quantity",
          "productName": "$productItems.productName",
          "cancel": "$depositRules.cancel",
          "staffId": "$staffId",
          "orderDateTime": "$orderDateTime",
          "comment": "$comment",
          "orderNumber": "$orderNumber"
        }
      }, {
        $match: {
          "cancel": true
        }
      }, { "$addFields": { "staffIdIdObj": { "$toObjectId": "$staffId" } } },
        {
          $lookup:
          {
            from: "staffs",
            localField: "staffIdIdObj",
            foreignField: "_id",
            as: "staffs"
          }
        }, {
        $project: {
          "itemCancels": [{
            "orderTime": { $dateToString: { format: "%d/%m/%Y %H:%M:%S", date: "$orderDateTime" } },
            "staffName": { $ifNull: [{ $arrayElemAt: ["$staffs.fullName", 0] }, ""] },
            "productName": "$productName",
            "price": "$priceOrder",
            "quantity": "$quantity",
            "reason": "$comment",
            "orderNumber": "$orderNumber"
          }]
        }
      });
      this.orderSpecialReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderSpecialReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderSpecialReport>>) => {
        let orderSpecialReportOrders: OrderSpecialReport = new OrderSpecialReport();
        for (let orderSpecialReport of httpStatus.entity) {
          if (orderSpecialReport.itemCancels != null && orderSpecialReport.itemCancels.length > 0) {
            orderSpecialReportOrders.itemCancels.push(orderSpecialReport.itemCancels[0]);
          }
        }
        orderSpecialReportOrders.searchCriterial = orderSpecialReportParam.searchCriterial;
        let orderSpecialReportOrdersArr = new Array<OrderSpecialReport>();
        orderSpecialReportOrdersArr.push(orderSpecialReportOrders);
        let httpStatusOrderSpecialReportOrders = new HttpStatus(httpStatus.code, orderSpecialReportOrdersArr);
        this.orderSpecialReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusOrderSpecialReportOrders);
      }).catch((err) => {
        this.orderSpecialReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getOrderProductItemCancel ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderSpecialReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
    * getReportPayment      
   */
  public getReportDayRevenue(): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let orderReportCriterial: OrderReportCriterial = new OrderReportCriterial();
      orderReportCriterial.status = 'OPEN';
      orderReportCriterial.fromDate = new Date().toISOString().slice(0, 10);
      let conditionList = this.getConditions(orderReportCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $group: {
          _id: "$orderType",
          orderCount: { $sum: 1 }
        }
      }, {
        $project: {
          "chartData": [{
            "name": "$_id",
            "value": "$orderCount"
          }]
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportDashboard: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.chartData != null && orderReport.chartData.length > 0) {
            orderReportDashboard.chartData.push(orderReport.chartData[0]);
          }
        }
        this.getTotalOrder(orderReportCriterial).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
          if (httpStatus.entity != null && httpStatus.entity.length > 0) {
            orderReportDashboard.totalNumber = httpStatus.entity[0].totalNumber;
            orderReportDashboard.totalPrice = httpStatus.entity[0].totalPrice;
          }
          let orderReportDashboardsArr = new Array<OrderReport>();
          orderReportDashboardsArr.push(orderReportDashboard);
          let httpStatusReportDashboard = new HttpStatus(httpStatus.code, orderReportDashboardsArr);
          this.orderReportManager.classInfo.mongoGetAggregate = null;
          resolve(httpStatusReportDashboard);
        });
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportDayRevenue ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
    * get all Categories and Product Items Counts      
  */
  public getTotalOrder(orderReportCriterial: OrderReportCriterial): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let conditionList = this.getConditions(orderReportCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $group: {
          _id: null,
          price: { $sum: "$priceOrder" }, "orderCount": { $sum: 1 }
        }
      }, {
        $project: {
          totalNumber: "$orderCount",
          totalPrice: "$price"
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getTotalOrder ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
     * getReport7DayRevenue     
     */
  public getReport7DayRevenue(): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let orderReportCriterial: OrderReportCriterial = new OrderReportCriterial();
      orderReportCriterial.fromDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10);
      orderReportCriterial.toDate = new Date().toISOString().slice(0, 10);
      let conditionList = this.getConditions(orderReportCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $project: {
          orderDate: { $dateToString: { format: "%d/%m", date: "$orderDateTime" } },
          priceOrder: "$priceOrder"
        }
      }, {
        $group: {
          _id: "$orderDate",
          price: { $sum: "$priceOrder" }
        }
      },
        {
          $project: {
            "chartData": [{
              "name": "$_id",
              "value": "$price"
            }]
          }
        }, {
        '$sort': {
          '_id': 1
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let report7DayRevenue: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.chartData != null && orderReport.chartData.length > 0) {
            report7DayRevenue.chartData.push(orderReport.chartData[0]);
          }
        }
        let report7DayRevenueArr = new Array<OrderReport>();
        report7DayRevenueArr.push(report7DayRevenue);
        let httpStatusReport7DayRevenuet = new HttpStatus(httpStatus.code, report7DayRevenueArr);
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusReport7DayRevenuet);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReport7DayRevenue ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  private getConditions(searchCriterial: OrderReportCriterial): Array<any> {
    let conditionList: Array<any> = [];
    if (this.isNotBlank(searchCriterial.fromDate)) {
      let fromDate = searchCriterial.fromDate;
      let toDate = fromDate;
      if (this.isNotBlank(searchCriterial.toDate)) {
        toDate = searchCriterial.toDate;
      }
      let fromDt = IsoDateHelper.convertIsoDate(fromDate + 'T' + searchCriterial.fromTime + ':00.000Z');
      let toDt = IsoDateHelper.convertIsoDate(toDate + 'T' + searchCriterial.toTime + ':00.000Z');
      conditionList.push({
        'orderDateTime': { $gte: fromDt, $lt: toDt }
      });
    }
    if (this.isNotBlank(searchCriterial.payment)) {
      let payment = searchCriterial.payment;
      conditionList.push({
        'paymentMethod': payment
      });
    }
    if (this.isNotBlank(searchCriterial.paymentList)) {
      conditionList.push({
        'paymentMethod': { "$in": searchCriterial.paymentList }
      });
    }
    if (this.isNotBlank(searchCriterial.staffId)) {
      let staffId = searchCriterial.staffId;
      conditionList.push({
        'staffId': staffId
      });
    }
    if (this.isNotBlank(searchCriterial.staffIdList)) {
      conditionList.push({
        'staffId': { "$in": searchCriterial.staffIdList }
      });
    }
    if (this.isNotBlank(searchCriterial.serviceType)) {
      let serviceType = searchCriterial.serviceType;
      conditionList.push({
        'orderType': serviceType
      });
    }
    if (this.isNotBlank(searchCriterial.serviceTypeList)) {
      conditionList.push({
        'orderType': { "$in": searchCriterial.serviceTypeList }
      });
    }
    if (this.isNotBlank(searchCriterial.status)) {
      let status = searchCriterial.status;
      conditionList.push({
        'status': status
      });
    } else if (this.isNotBlank(searchCriterial.statusList) == false) {
      conditionList.push({
        'status': 'BILL'
      });
    }
    if (this.isNotBlank(searchCriterial.statusList)) {
      conditionList.push({
        'status': { "$in": searchCriterial.statusList }
      });
    }
    if (conditionList.length == 0) {
      let date = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh').toISOString().substring(0, 10),
        timeFrom = "00:00",
        timeTo = "23:59";
      let fromDt = IsoDateHelper.convertIsoDate(date + 'T' + timeFrom + ':00.000Z');
      let toDt = IsoDateHelper.convertIsoDate(date + 'T' + timeTo + ':00.000Z');
      conditionList.push({
        'orderDateTime': { $gte: fromDt, $lt: toDt }
      });
    }
    return conditionList;
  }

  private isNotBlank(value: any): boolean {
    return value !== null && value !== undefined && (value.length === undefined || value.length > 0);
  }
  /**
   * getReportPaymentAndChart      
   */
  public getReportInventory(rawMaterialsReportPamram: RawMaterialsReport): Promise<HttpStatus<Array<RawMaterialsReport>>> {
    let promise = new Promise<HttpStatus<Array<RawMaterialsReport>>>((resolve, reject) => {
      let rawMaterialService: RawMaterialService = new RawMaterialService(this.orderReportManager.user);
      rawMaterialService.getAllRawMaterials(rawMaterialsReportPamram.searchCriterial.rawMaterialType).then((httpStatusRawMaterials: HttpStatus<Array<RawMaterials>>) => {
        if (httpStatusRawMaterials != null && httpStatusRawMaterials.entity.length > 0) {
          let rawMaterialArray: Array<RawMaterials> = httpStatusRawMaterials.entity;
          let rawMaterialinputService: RawMaterialinputService = new RawMaterialinputService(this.orderReportManager.user);
          let rawMaterialInputMap = new Map();
          let rawMaterialInputArray: Array<RawMaterialInput> = [];
          let rawMaterialsReportInOuts: Array<RawMaterialsReportInOut> = new Array<RawMaterialsReportInOut>();
          let rawMaterialsReportArray: Array<RawMaterialsReport> = new Array<RawMaterialsReport>();
          let rawMaterialsReport: RawMaterialsReport = new RawMaterialsReport();
          rawMaterialinputService.getRawMaterialInputHistory(rawMaterialsReportPamram).then((httpStatusRawMaterialInput: HttpStatus<Array<RawMaterialInput>>) => {
            if (httpStatusRawMaterialInput != null && httpStatusRawMaterialInput.entity.length > 0) {
              for (let rawMaterialInput of httpStatusRawMaterialInput.entity) {
                if (rawMaterialInputMap.has(rawMaterialInput._id)) {
                  rawMaterialInputArray = rawMaterialInputMap.get(rawMaterialInput._id);
                } else {
                  rawMaterialInputArray = new Array<RawMaterialInput>();
                }
                rawMaterialInputArray.push(rawMaterialInput);
                rawMaterialInputMap.set(rawMaterialInput._id, rawMaterialInputArray);
              }
            }
            rawMaterialsReportInOuts = this.bindingRawMaterialsReportInOut(rawMaterialArray, rawMaterialInputMap);
            rawMaterialsReport.searchCriterial = rawMaterialsReportPamram.searchCriterial;
            rawMaterialsReport.rawMaterials = rawMaterialsReportInOuts;
            rawMaterialsReportArray.push(rawMaterialsReport);
            resolve(new HttpStatus<Array<RawMaterialsReport>>(HttpStatus.OK, rawMaterialsReportArray));
          }).catch((err) => {
            rawMaterialsReportInOuts = this.bindingRawMaterialsReportInOut(rawMaterialArray, rawMaterialInputMap);
            rawMaterialsReport.searchCriterial = rawMaterialsReportPamram.searchCriterial;
            rawMaterialsReport.rawMaterials = rawMaterialsReportInOuts;
            rawMaterialsReportArray.push(rawMaterialsReport);
            resolve(new HttpStatus<Array<RawMaterialsReport>>(HttpStatus.OK, rawMaterialsReportArray));
          });
        }
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-ReportService-getReportInventory ' + JSON.stringify(err) + ' --data --' + JSON.stringify(rawMaterialsReportPamram));
        resolve(new HttpStatus<Array<RawMaterialsReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }

  private bindingRawMaterialsReportInOut(rawMaterialArray: Array<RawMaterials>, rawMaterialInputMap: any): Array<RawMaterialsReportInOut> {
    let rawMaterialsReportInOuts: Array<RawMaterialsReportInOut> = new Array<RawMaterialsReportInOut>();
    let rawMaterialInputArray: Array<RawMaterialInput> = [];
    let rawMaterialsReportInOut: RawMaterialsReportInOut;
    for (let rawMaterial of rawMaterialArray) {
      rawMaterialsReportInOut = new RawMaterialsReportInOut();
      rawMaterialsReportInOut.rawMaterialName = rawMaterial.name;
      rawMaterialsReportInOut.quantityRemain = rawMaterial.amountRemain;
      rawMaterialsReportInOut.quantityMin = rawMaterial.minAmount;
      if (rawMaterial.amountRemain <= rawMaterial.minAmount) {
        rawMaterialsReportInOut.outOfstock = true;
      }
      rawMaterialsReportInOut.unit = rawMaterial.unitName;
      if (rawMaterialInputMap.has(rawMaterial._id)) {
        rawMaterialInputArray = rawMaterialInputMap.get(rawMaterial._id);
        for (let rawMaterialInput of rawMaterialInputArray) {
          //INCREASE,DECREASE,BILL,'BILL_RETURN'
          if ('INCREASE' === rawMaterialInput.actionType) {
            rawMaterialsReportInOut.quantityIncrease = rawMaterialInput.amount;
          } else if ('DECREASE' === rawMaterialInput.actionType) {
            rawMaterialsReportInOut.quantityDecrease = rawMaterialInput.amount;
          } else if ('BILL' === rawMaterialInput.actionType) {
            rawMaterialsReportInOut.quantitySell = rawMaterialInput.amount;
          }
        }
      }
      rawMaterialsReportInOuts.push(rawMaterialsReportInOut);
    }
    return rawMaterialsReportInOuts;
  }
  /**
     * getReportPayment      
    */
  public getReportDayRevenueDetail(): Promise<HttpStatus<Array<OrderReport>>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let orderReportCriterial: OrderReportCriterial = new OrderReportCriterial();
      orderReportCriterial.status = 'OPEN';
      orderReportCriterial.fromDate = new Date().toISOString().slice(0, 10);
      let conditionList = this.getConditions(orderReportCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push({
        $group: {
          _id: "$orderType",
          orderCount: { $sum: 1 }
        }
      }, {
        $project: {
          "chartData": [{
            "name": "$_id",
            "value": "$orderCount"
          }]
        }
      });
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportDashboard: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.chartData != null && orderReport.chartData.length > 0) {
            orderReportDashboard.chartData.push(orderReport.chartData[0]);
          }
        }
        this.getTotalOrder(orderReportCriterial).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
          if (httpStatus.entity != null && httpStatus.entity.length > 0) {
            orderReportDashboard.totalNumber = httpStatus.entity[0].totalNumber;
            orderReportDashboard.totalPrice = httpStatus.entity[0].totalPrice;
          }
          let orderReportDashboardsArr = new Array<OrderReport>();
          orderReportDashboardsArr.push(orderReportDashboard);
          let httpStatusReportDashboard = new HttpStatus(httpStatus.code, orderReportDashboardsArr);
          this.orderReportManager.classInfo.mongoGetAggregate = null;
          resolve(httpStatusReportDashboard);
        });
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportDayRevenueDetail ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }
  /**
   * getReportCurrentOrdersDetail     
   */
  public getReportCurrentOrdersDetail(): Promise<HttpStatus<OrderReport[]>> {
    let promise = new Promise<HttpStatus<Array<OrderReport>>>((resolve, reject) => {
      let pipeList: Array<any> = [];
      let orderReportCriterial: OrderReportCriterial = new OrderReportCriterial();
      orderReportCriterial.status = 'OPEN';
      orderReportCriterial.fromDate = new Date().toISOString().slice(0, 10);
      let conditionList = this.getConditions(orderReportCriterial);
      pipeList.push({
        $match: {
          $and: conditionList
        }
      });
      pipeList.push(
        { "$addFields": { "tableIdIdObj": { "$toObjectId": "$table" } } },
        {
          $lookup:
          {
            from: "tables",
            localField: "tableIdIdObj",
            foreignField: "_id",
            as: "tables"
          }
        },
        {
          $project: {
            "orderReportDetails": [{
              "orderNumber": "$orderNumber",
              "orderTimeStart": { $dateToString: { format: "%H:%M", date: "$orderDateTime" } },
              "priceOrder": "$priceOrder",
              "orderType": "$orderType",
              "peopleCount": "$peopleCount",
              "table": { $ifNull: [{ $arrayElemAt: ["$tables.tableName", 0] }, ""] }
            }]
          }
        }
      );
      this.orderReportManager.classInfo.mongoGetAggregate = pipeList;
      this.orderReportManager.search({}).then((httpStatus: HttpStatus<Array<OrderReport>>) => {
        let orderReportDetails: OrderReport = new OrderReport();
        for (let orderReport of httpStatus.entity) {
          if (orderReport.orderReportDetails != null && orderReport.orderReportDetails.length > 0) {
            orderReportDetails.orderReportDetails.push(orderReport.orderReportDetails[0]);
          }
        }
        orderReportDetails.searchCriterial = orderReportCriterial;
        let orderReportDetailsArr = new Array<OrderReport>();
        orderReportDetailsArr.push(orderReportDetails);
        let httpStatusOrderReportDetails = new HttpStatus(httpStatus.code, orderReportDetailsArr);
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatusOrderReportDetails);
      }).catch((err) => {
        this.orderReportManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ReportService-getReportCurrentOrdersDetail ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        resolve(new HttpStatus<Array<OrderReport>>(HttpStatus.NO_CONTENT, null));
      });
    });
    return promise;
  }

}