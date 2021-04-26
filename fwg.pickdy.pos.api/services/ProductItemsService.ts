import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import ProductItemsManager from "../../fwg.pickdy.pos.common/model/manager/ProductItemsManager";
import RawMaterialsManager from "../../fwg.pickdy.pos.common/model/manager/RawMaterialsManager";
import RawMaterialsInputManager from "../../fwg.pickdy.pos.common/model/manager/RawMaterialsInputManager";
import ProductItemModifierManager from "../../fwg.pickdy.pos.common/model/manager/ProductItemModifierManager";
import ProductItems from "../../fwg.pickdy.pos.common/model/ProductItems";
import RawMaterials from "../../fwg.pickdy.pos.common/model/RawMaterials";
import RawMaterialInputs from "../../fwg.pickdy.pos.common/model/RawMaterialInputs";
import ProductItemRawMaterial from "../../fwg.pickdy.pos.common/model/ProductItemRawMaterial";
import ProductItemModifierList from "../../fwg.pickdy.pos.common/model/ProductItemModifierList";
import CategoriesManager from "../../fwg.pickdy.pos.common/model/manager/CategoriesManager";
import Categories from "../../fwg.pickdy.pos.common/model/Categories";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
import path = require("path");
import AppConfiguration from "../../fwg.pickdy.common/utilities/AppConfig";
const fs = require('fs');
export default class ProductItemsService {
  protected productItemsManager: ProductItemsManager;
  protected rawMaterialsManager: RawMaterialsManager;
  protected productItemModifierManager: ProductItemModifierManager;
  protected rawMaterialsInputManager: RawMaterialsInputManager;
  protected categoriesManager: CategoriesManager;
  constructor(user: Staffs) {
    this.productItemsManager = new ProductItemsManager(user);
    this.rawMaterialsManager = new RawMaterialsManager(user);
    this.productItemModifierManager = new ProductItemModifierManager(user);
    this.rawMaterialsInputManager = new RawMaterialsInputManager(user);
    this.categoriesManager = new CategoriesManager(user);
  }
  /**
   * get all ProductItems     
   */
  public getProductItems(): Promise<HttpStatus<Array<ProductItems>>> {
    let promise = new Promise<HttpStatus<Array<ProductItems>>>((resolve, reject) => {
      let pipeList: Array<any> = [
        {
          $match:
          {
            productType: { $ne: "MODIFIER" }
          }
        },
        {
          $addFields: { "categoriesOb": { "$toObjectId": "$categories" } }
        },
        {
          $lookup:
          {
            from: "categories",
            localField: "categoriesOb",
            foreignField: "_id",
            as: "categorielists"
          }
        },
        {
          $project:
          {
            productName: 1,
            shopId: 1,
            categories: 1,
            prices: 1,
            unitType: 1,
            printers: 1,
            createByUserId: 1,
            updateByUserId: 1,
            createDateTime: 1,
            updateDateTime: 1,
            rawMaterials: 1,
            itemAdditionals: 1,
            image: 1,
            categoryName: { $ifNull: [{ $arrayElemAt: ["$categorielists.categoryName", 0] }, ""] },
            productType: 1
          }
        }
      ];
      this.productItemsManager.classInfo.mongoGetAggregate = pipeList;
      this.productItemsManager.search(null).then((httpStatus: HttpStatus<Array<ProductItems>>) => {
        this.productItemsManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.productItemsManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-ProductItemsService-getProductItems ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  /**
   * get getAllProductModifier     
   */
  public getAllProductModifier(): Promise<HttpStatus<Array<ProductItems>>> {
    let promise = new Promise<HttpStatus<Array<ProductItems>>>((resolve, reject) => {
      this.productItemsManager.search({ "productType": "MODIFIER" }).then((httpStatus: HttpStatus<Array<ProductItems>>) => {
        resolve(httpStatus);
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-ProductItemsService-getAllProductModifier ' + JSON.stringify(err) + ' --data --' + JSON.stringify({ "productType": "MODIFIER" }));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  public insertProductItem(productItems: ProductItems): Promise<HttpStatus<ProductItems>> {
    let promise = new Promise<HttpStatus<ProductItems>>((resolve, reject) => {
      // check Category
      if (productItems.categories == null || productItems.categories.trim() == '' || productItems.categories.trim() == 'null') {
        this.categoriesManager.search({ "categoryType": "NOON" }).then((httpStatusCategories: HttpStatus<Array<Categories>>) => {
          if (httpStatusCategories != null && httpStatusCategories.entity != null && httpStatusCategories.entity.length > 0) {
            productItems.categories = httpStatusCategories.entity[0]._id;
            // CREATE INVENTORY ITEM
            if (productItems.rawMaterials != null && productItems.rawMaterials.length == 1 && "INVENTORY" == productItems.rawMaterials[0].trackingType) {
              let productItemRawMaterial: ProductItemRawMaterial = productItems.rawMaterials[0];
              let rawMaterials: RawMaterials = new RawMaterials();
              rawMaterials.name = productItems.productName;
              rawMaterials.minAmount = productItemRawMaterial.amount;
              rawMaterials.amountRemain = productItemRawMaterial.minAmount;
              rawMaterials.rawMaterialType = productItemRawMaterial.trackingType;
              rawMaterials.shopId = productItems.shopId;
              this.rawMaterialsManager.create(rawMaterials).then((httpStatus: HttpStatus<RawMaterials>) => {
                productItems.rawMaterials[0].rawMaterialId = httpStatus.entity._id;
                if (productItemRawMaterial.amount > 0) {
                  let rawMaterialInputs: RawMaterialInputs = new RawMaterialInputs();
                  rawMaterialInputs.amount = productItemRawMaterial.amount;
                  rawMaterialInputs.rawMaterialId = productItems.rawMaterials[0].rawMaterialId;
                  rawMaterialInputs.shopId = productItems.shopId;
                  this.rawMaterialsInputManager.create(rawMaterialInputs).then((httpStatus: HttpStatus<RawMaterialInputs>) => {
                  }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                    reject(HttpStatus.getHttpStatus(err));
                  });
                }
                this.convertImageToSave(productItems);
                this.productItemsManager.create(productItems).then((httpStatus: HttpStatus<ProductItems>) => {
                  resolve(httpStatus);
                }).catch((err) => {
                  PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                  reject(HttpStatus.getHttpStatus(err));
                });
              }).catch((err) => {
                console.log(err + "-data--" + JSON.stringify(productItems));
                reject(HttpStatus.getHttpStatus(err));
              });
            } else {
              this.convertImageToSave(productItems);
              this.productItemsManager.create(productItems).then((httpStatus: HttpStatus<ProductItems>) => {
                resolve(httpStatus);
              }).catch((err) => {
                PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                reject(HttpStatus.getHttpStatus(err));
              });
            }
          } else {
            let categories: Categories = new Categories();
            categories.categoryName = 'KHÔNG';
            categories.categoryType = 'NOON';
            categories.shopId = productItems.shopId;
            this.categoriesManager.create(categories).then((httpStatusCategory: HttpStatus<Categories>) => {
              productItems.categories = httpStatusCategory.entity._id;
              // CREATE INVENTORY ITEM
              if (productItems.rawMaterials != null && productItems.rawMaterials.length == 1 && "INVENTORY" == productItems.rawMaterials[0].trackingType) {
                let productItemRawMaterial: ProductItemRawMaterial = productItems.rawMaterials[0];
                let rawMaterials: RawMaterials = new RawMaterials();
                rawMaterials.name = productItems.productName;
                rawMaterials.minAmount = productItemRawMaterial.amount;
                rawMaterials.amountRemain = productItemRawMaterial.minAmount;
                rawMaterials.rawMaterialType = productItemRawMaterial.trackingType;
                rawMaterials.shopId = productItems.shopId;
                this.rawMaterialsManager.create(rawMaterials).then((httpStatus: HttpStatus<RawMaterials>) => {
                  productItems.rawMaterials[0].rawMaterialId = httpStatus.entity._id;
                  if (productItemRawMaterial.amount > 0) {
                    let rawMaterialInputs: RawMaterialInputs = new RawMaterialInputs();
                    rawMaterialInputs.amount = productItemRawMaterial.amount;
                    rawMaterialInputs.rawMaterialId = productItems.rawMaterials[0].rawMaterialId;
                    rawMaterialInputs.shopId = productItems.shopId;
                    this.rawMaterialsInputManager.create(rawMaterialInputs).then((httpStatus: HttpStatus<RawMaterialInputs>) => {
                    }).catch((err) => {
                      PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                      reject(HttpStatus.getHttpStatus(err));
                    });
                  }
                  this.convertImageToSave(productItems);
                  this.productItemsManager.create(productItems).then((httpStatus: HttpStatus<ProductItems>) => {
                    resolve(httpStatus);
                  }).catch((err) => {
                    PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                    reject(HttpStatus.getHttpStatus(err));
                  });
                }).catch((err) => {
                  PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                  reject(HttpStatus.getHttpStatus(err));
                });
              } else {
                this.convertImageToSave(productItems);
                this.productItemsManager.create(productItems).then((httpStatus: HttpStatus<ProductItems>) => {
                  resolve(httpStatus);
                }).catch((err) => {
                  PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                  reject(HttpStatus.getHttpStatus(err));
                });
              }
            }).catch((err) => {
              PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
              reject(HttpStatus.getHttpStatus(err));
            });
          }
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
          reject(HttpStatus.getHttpStatus(err));
        });
      } else {
        // CREATE INVENTORY ITEM
        if (productItems.rawMaterials != null && productItems.rawMaterials.length == 1 && "INVENTORY" == productItems.rawMaterials[0].trackingType) {
          let productItemRawMaterial: ProductItemRawMaterial = productItems.rawMaterials[0];
          let rawMaterials: RawMaterials = new RawMaterials();
          rawMaterials.name = productItems.productName;
          rawMaterials.minAmount = productItemRawMaterial.amount;
          rawMaterials.amountRemain = productItemRawMaterial.minAmount;
          rawMaterials.rawMaterialType = productItemRawMaterial.trackingType;
          rawMaterials.shopId = productItems.shopId;
          this.rawMaterialsManager.create(rawMaterials).then((httpStatus: HttpStatus<RawMaterials>) => {
            productItems.rawMaterials[0].rawMaterialId = httpStatus.entity._id;
            if (productItemRawMaterial.amount > 0) {
              let rawMaterialInputs: RawMaterialInputs = new RawMaterialInputs();
              rawMaterialInputs.amount = productItemRawMaterial.amount;
              rawMaterialInputs.rawMaterialId = productItems.rawMaterials[0].rawMaterialId;
              rawMaterialInputs.shopId = productItems.shopId;
              this.rawMaterialsInputManager.create(rawMaterialInputs).then((httpStatus: HttpStatus<RawMaterialInputs>) => {
              }).catch((err) => {
                PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
                reject(HttpStatus.getHttpStatus(err));
              });
            }
            this.convertImageToSave(productItems);
            this.productItemsManager.create(productItems).then((httpStatus: HttpStatus<ProductItems>) => {
              resolve(httpStatus);
            }).catch((err) => {
              PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
              reject(HttpStatus.getHttpStatus(err));
            });
          }).catch((err) => {
            PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
            reject(HttpStatus.getHttpStatus(err));
          });
        } else {
          this.convertImageToSave(productItems);
          this.productItemsManager.create(productItems).then((httpStatus: HttpStatus<ProductItems>) => {
            resolve(httpStatus);
          }).catch((err) => {
            PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
            reject(HttpStatus.getHttpStatus(err));
          });
        }
      }
    });
    return promise;
  }
  private convertImageToSave(productItems: ProductItems):void {
    if(productItems.image!=null && productItems.image.trim()!='' && productItems.image.indexOf('base64')>0){
      var pathImageUrl:string;
      var pathFolder:string = path.join(__dirname, this.productItemsManager.user.shopId) ;
      pathFolder = pathFolder.replace('services','upload');
      if (!fs.existsSync(pathFolder)){
        fs.mkdirSync(pathFolder);
      }    
      var imagePath:string = Date.now()+'.png';
      pathFolder = path.join(pathFolder,imagePath);     
      pathImageUrl =AppConfiguration.GetConfiguration(AppConfiguration.REST_API_HOST)+'/'+this.productItemsManager.user.shopId+'/'+imagePath;
      const base64Data = productItems.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');        
      fs.writeFileSync(pathFolder, base64Data,  {encoding: 'base64'});      
      productItems.image = pathImageUrl;
    }
  }
  public updateProductItem(productItems: ProductItems): Promise<HttpStatus<ProductItems>> {
    let promise = new Promise<HttpStatus<ProductItems>>((resolve, reject) => {
      // CREATE INVENTORY ITEM
      if (productItems.rawMaterials != null && productItems.rawMaterials.length == 1
        && "INVENTORY" == productItems.rawMaterials[0].trackingType && productItems.rawMaterials[0].rawMaterialId == null) {
        let productItemRawMaterial: ProductItemRawMaterial = productItems.rawMaterials[0];
        let rawMaterials: RawMaterials = new RawMaterials();
        rawMaterials.name = productItems.productName;
        rawMaterials.amountRemain = productItemRawMaterial.minAmount;
        rawMaterials.rawMaterialType = productItemRawMaterial.trackingType;
        this.rawMaterialsManager.create(rawMaterials).then((httpStatus: HttpStatus<RawMaterials>) => {
          productItems.rawMaterials[0].rawMaterialId = httpStatus.entity._id;
          this.convertImageToSave(productItems);
          this.productItemsManager.update({ '_id': this.productItemsManager.objectID(productItems._id) }, productItems).then((httpStatus: HttpStatus<ProductItems>) => {
            resolve(httpStatus);
          }).catch((err) => {
            PickdyLogHelper.error('SERVICE-ProductItemsService-updateProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
            reject(HttpStatus.getHttpStatus(err));
          });
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-ProductItemsService-updateProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
          reject(HttpStatus.getHttpStatus(err));
        });
        if (productItemRawMaterial.amount > 0) {
          let rawMaterialInputs: RawMaterialInputs = new RawMaterialInputs();
          rawMaterialInputs.amount = productItemRawMaterial.amount;
          rawMaterialInputs.rawMaterialId = productItems.rawMaterials[0].rawMaterialId;
          this.rawMaterialsInputManager.create(rawMaterialInputs).then((httpStatus: HttpStatus<RawMaterialInputs>) => {
          }).catch((err) => {
            PickdyLogHelper.error('SERVICE-ProductItemsService-updateProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
            reject(HttpStatus.getHttpStatus(err));
          });
        }
      } else {
        this.convertImageToSave(productItems);
        this.productItemsManager.update({ '_id': this.productItemsManager.objectID(productItems._id) }, productItems).then((httpStatus: HttpStatus<ProductItems>) => {
          resolve(httpStatus);
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-ProductItemsService-updateProductItem ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItems));
          reject(HttpStatus.getHttpStatus(err));
        });
      }
    });
    return promise;
  }

  public insertProductItemModifierList(productItemModifierList: ProductItemModifierList): Promise<HttpStatus<ProductItems>> {
    let promise = new Promise<HttpStatus<ProductItems>>((resolve, reject) => {
      productItemModifierList.productItems.productType = 'MODIFIER';
      this.productItemsManager.create(productItemModifierList.productItems).then((httpStatus: HttpStatus<ProductItems>) => {
        let productItemModifierPromises: Array<any> = [];
        for (let productItemModifier of productItemModifierList.productItemModifiers) {
          productItemModifier.productItemParrentId = httpStatus.entity._id;
          productItemModifierPromises.push(this.productItemModifierManager.insert(productItemModifier));
        }
        Promise.all(productItemModifierPromises).then(httpStatusproductItemModifier => {
          resolve(httpStatus);
        }).catch((err) => {
          PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItemModifierList ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItemModifierList));
          reject(HttpStatus.getHttpStatus(err));
        });
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-ProductItemsService-insertProductItemModifierList ' + JSON.stringify(err) + ' --data --' + JSON.stringify(productItemModifierList));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
  /**
     * get all ProductItems     
     */
  public getProductItemTakeAways(): Promise<HttpStatus<Array<ProductItems>>> {
    let promise = new Promise<HttpStatus<Array<ProductItems>>>((resolve, reject) => {
      let pipeList: Array<any> = [
        {
          $match:
          {
            productType: { $ne: "MODIFIER" },
            sellOnline: true
          }
        },
        { $sample: { size: 30 } },
        {
          $addFields: { "categoriesOb": { "$toObjectId": "$categories" } }
        },
        {
          $lookup:
          {
            from: "categories",
            localField: "categoriesOb",
            foreignField: "_id",
            as: "categorielists"
          }
        },
        {
          $project:
          {
            productName: 1,
            shopId: 1,
            categories: 1,
            prices: 1,
            unitType: 1,
            printers: 1,
            createByUserId: 1,
            updateByUserId: 1,
            createDateTime: 1,
            updateDateTime: 1,
            rawMaterials: 1,
            itemAdditionals: 1,
            image: 1,
            categoryName: { $ifNull: [{ $arrayElemAt: ["$categorielists.categoryName", 0] }, ""] },
            productType: 1
          }
        }
      ];
      this.productItemsManager.classInfo.mongoGetAggregate = pipeList;
      this.productItemsManager.search(null).then((httpStatus: HttpStatus<Array<ProductItems>>) => {
        this.productItemsManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        PickdyLogHelper.error('SERVICE-ProductItemsService-getProductItemTakeAways ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        this.productItemsManager.classInfo.mongoGetAggregate = null;
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
}