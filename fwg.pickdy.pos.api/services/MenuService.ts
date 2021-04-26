import MenusManager from "../../fwg.pickdy.pos.common/model/manager/MenusManager";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Menus from "../../fwg.pickdy.pos.common/model/Menus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import ProductItems from "../../fwg.pickdy.pos.common/model/ProductItems";
import ShopsManager from "../../fwg.pickdy.pos.common/model/manager/ShopsManager";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";

export default class MenuService {
    protected menusManager: MenusManager;
    protected shopsManager: ShopsManager;
    constructor(user: Staffs) {
        this.menusManager = new MenusManager(user);
        this.shopsManager = new ShopsManager(user);
    }
    /**
     * get all ProductItems by Menu Id      
     */
    public getAllProductItemsByMenuId(menuId: string): Promise<HttpStatus<Menus>> {
        let promise = new Promise<HttpStatus<Menus>>((resolve, reject) => {
            this.menusManager = new MenusManager(null);
            let pipeList: Array<any> = [{
                $match:
                {
                    _id: this.menusManager.objectID(menuId)
                }
            }, {
                $unwind: {
                    path: "$productItems"
                }
            },
            { "$addFields": { "productItemsIdObj": { "$toObjectId": "$productItems" } } },
            {
                $lookup:
                {
                    from: "productItems",
                    localField: "productItemsIdObj",
                    foreignField: "_id",
                    as: "productItemValues"
                }
            }, {
                $project:
                {
                    "menuName": 1,
                    "shopId": 1,
                    "effectDateTime": 1,
                    "endDateTime": 1,
                    "icon": 1,
                    "createByUserId": 1,
                    "updateByUserId": 1,
                    "createDateTime": 1,
                    "updateDateTime": 1,
                    "productItemValues": "$productItemValues",
                    "productItems": ["$productItems"]
                }
            }
            ];
            this.menusManager.classInfo.mongoGetAggregate = pipeList;
            this.menusManager.classInfo.mongoCollectionName = 'menus';
            this.menusManager.search(null).then((httpStatus: HttpStatus<Array<Menus>>) => {
                this.menusManager.classInfo.mongoGetAggregate = null;
                if (httpStatus.entity != null && httpStatus.entity.length > 0) {
                    let menu: Menus = httpStatus.entity[0];
                    let productItemValues = new Array<ProductItems>();
                    let productItems = new Array<string>();
                    for (let menuTmp of httpStatus.entity) {
                        if (menuTmp.productItemValues && menuTmp.productItemValues.length > 0) {
                            productItemValues.push(menuTmp.productItemValues[0]);
                        }
                        if (menuTmp.productItems && menuTmp.productItems.length > 0) {
                            productItems.push(menuTmp.productItems[0]);
                        }
                    }
                    menu.productItemValues = productItemValues;
                    menu.productItems = productItems;
                    resolve(new HttpStatus<Menus>(HttpStatus.OK, menu));
                } else {
                    resolve(new HttpStatus<Menus>(HttpStatus.NO_CONTENT, null));
                }

            }).catch((err) => {
                this.menusManager.classInfo.mongoGetAggregate = null;
                PickdyLogHelper.error('SERVICE-MenuService-getAllProductItemsByMenuId ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
                return this.menusManager.get(menuId);
            });
        });
        return promise;
    }
    /**
    * get all MEnu by Menu Id      
    */
    public getAllMenuOnlineByShopId(shopId: string): Promise<HttpStatus<Array<Menus>>> {
        let promise = new Promise<HttpStatus<Array<Menus>>>((resolve, reject) => {
            this.menusManager = new MenusManager(null);
            let pipeList: Array<any> = [{
                $match:
                {
                    _id: this.shopsManager.objectID(shopId)
                }
            }
            ];
            this.menusManager.classInfo.mongoGetAggregate = pipeList;
            this.menusManager.classInfo.mongoCollectionName = 'menus';
            this.menusManager.search(null).then((httpStatus: HttpStatus<Array<Menus>>) => {
                this.menusManager.classInfo.mongoGetAggregate = null;
                if (httpStatus.entity != null && httpStatus.entity.length > 0) {
                    resolve(httpStatus);
                } else {
                    resolve(new HttpStatus<Array<Menus>>(HttpStatus.NO_CONTENT, null));
                }
            }).catch((err) => {
                this.menusManager.classInfo.mongoGetAggregate = null;
                PickdyLogHelper.error('SERVICE-MenuService-getAllMenuOnlineByShopId ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
            });
        });
        return promise;
    }
}