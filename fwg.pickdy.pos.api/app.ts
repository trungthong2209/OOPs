import express = require("express");
import path = require("path");
import HttpStatus from "../fwg.pickdy.common/base/HttpStatus";
import AppConfigurationOptions from "./AppConfigurationOptions";
import AppConfig from "../fwg.pickdy.common/utilities/AppConfig";
import MongoDB from "../fwg.pickdy.common/utilities/helpers/MongoDb";
import PickdyLogHelper from "./utilities/helper/PickdyLogHelper";
let bodyParser = require("body-parser");
let cors = require("cors");
import PickdyAppConfiguration from "./PickdyAppConfig";
import AppAttachments from "./attachments/AppAttachments";
import WebSocketServer from "../fwg.pickdy.common/utilities/helpers/WebSocketServer";
let app = express();
const dotenv = require('dotenv');
dotenv.config();
AppConfig.LoadConfiguration(AppConfigurationOptions); 
PickdyAppConfiguration.LoadConfiguration(AppConfigurationOptions);

AppConfig.LoadAttachments(AppAttachments);
let server = require('http').Server(app);
WebSocketServer.Initialise(server);
// import router
import categories from "./routes/categories";
import productItems from "./routes/productItems";
import productItemsModifier from "./routes/productItemsModifier";
import tables from "./routes/tables";
import units from "./routes/units";
import menus from "./routes/menus";
import rawMaterials from "./routes/rawMaterials";
import rawMaterialInputs from "./routes/rawMaterialInputs";
import shops from "./routes/shops";
import staffs from "./routes/staffs";
import orders from "./routes/orders";
import ordersTakeaway from "./routes/ordersTakeaway";
import discountEventRules from "./routes/discountEventRules";
import reports from "./routes/reports";
// end import router
import swaggerUi = require('swagger-ui-express');
import swaggerJSDoc = require('swagger-jsdoc');
MongoDB.init();
/**
 * Interface to support type for typescript
 */
declare module "express" {
  interface Response {
    sendSuccessResponse(status: number, data: any): void;
    sendSuccessHttpResponse(http: HttpStatus<any>): void;
    sendErrorResponse(code: number, message: string): void;
    sendErrorHttpResponse(http: HttpStatus<any>);
  }
}
/**
 * Create Middle response for api
 * @param req : Request
 * @param res : Response
 * @param next : Function
 */
let responseBody = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {
  res.sendSuccessResponse = (status: number, data: any) => {
    res
      .status(status)
      .json(data)
      .end();
  };
  res.sendSuccessHttpResponse = (httpStatus: HttpStatus<any>) => {
    res
      .status(httpStatus.code)
      .json(httpStatus.entity)
      .end();
  };
  res.sendErrorHttpResponse = (httpStatus: HttpStatus<any>) => {
    //  if (httpStatus.message.indexOf(PortalApiConstants.DUPLICATE_ERROR_KEY) != -1) {
    //it is use for capture the error for duplicate index.
    //after we will apply in HttpStatus class
    //res.status(HttpStatus.CONFLICT).json(HttpStatus.httpStatusCodes[HttpStatus.CONFLICT]).end();
    //  }
    //  else {
    res
      .status(httpStatus.code)
      .json(httpStatus.message)
      .end();
    // }
  };
  res.sendErrorResponse = (code: number, message: string) => {
    res
      .status(code)
      .json(message)
      .end();
  };
  next();
};
// allow cross site
app.use(cors());
app.use(responseBody);
// Parsers for POST data
app.use(bodyParser.json({ extended: true, limit: "16mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16mb" }));
// Point static path to dist
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "upload")));
PickdyLogHelper.initLogConfiguration();
// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "userid, authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.get("/", (req: any, res: any) => {
  let dir = path.join(__dirname, "upload");  
  res.write(
    'WELCOME TO API.BOSS.PICKZ.VN'
  );
  res.end();
});
app.use("/categories",categories);
app.use("/productItems",productItems);
app.use("/tables",tables);
app.use("/units",units);
app.use("/menus",menus);
app.use("/rawMaterials",rawMaterials);
app.use("/rawMaterialInputs",rawMaterialInputs);
app.use("/shops",shops);
app.use("/staffs",staffs);
app.use("/orders",orders);
app.use("/discountEventRules",discountEventRules);
app.use("/reports",reports);
app.use("/productItemModifier",productItemsModifier);
app.use("/ordersTakeaway",ordersTakeaway);

var swaggerDefinition = {
  info: {
    title: "POS API DOCUMENT",
    version: "1.0.0",
    description: "POS API DOCUMENT"
  },
  host: "157.245.51.171:3001",
  basePath: "/"
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./build/fwg.pickdy.pos.api/docs/*.yaml'],
};
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err: any, req: express.Request, res: express.Response, next) => {
    PickdyLogHelper.error("--- Begin : Application Error -----");
    PickdyLogHelper.error(req.url);
    PickdyLogHelper.error(req.body);
    PickdyLogHelper.error(err);
    PickdyLogHelper.error("--- End : Application Error -----");
    res.sendErrorHttpResponse(HttpStatus.getHttpStatus(err));
  });
} else {
  app.use((err: any, req: express.Request, res: express.Response, next) => {
    PickdyLogHelper.error("--- Begin : Application Error -----");
    PickdyLogHelper.error(req.url);
    PickdyLogHelper.error(req.body);
    PickdyLogHelper.error(err);
    PickdyLogHelper.error("--- End : Application Error -----");
    res.sendErrorHttpResponse(HttpStatus.getHttpStatus(err));
  });
}

module.exports = app;
