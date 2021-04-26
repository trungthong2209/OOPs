import CategoriesManager from "../../fwg.pickdy.pos.common/model/manager/CategoriesManager";
import Categories from "../../fwg.pickdy.pos.common/model/Categories";
import HttpStatus from "../../fwg.pickdy.common/base/HttpStatus";
import Staffs from "../../fwg.pickdy.pos.common/model/Staffs";
import PickdyLogHelper from "../utilities/helper/PickdyLogHelper";
export default class CategoryService {
  protected categoriesManager: CategoriesManager;
  constructor(user: Staffs) {
    this.categoriesManager = new CategoriesManager(user);
  }
  /**
   * get all Categories and Product Items Counts      
   */
  public getAllCategoryAndProductItemCount(): Promise<HttpStatus<Array<Categories>>> {
    let promise = new Promise<HttpStatus<Array<Categories>>>((resolve, reject) => {
      let pipeList: Array<any> =
        [
          {
            $addFields: { "idStr": { "$toString": "$_id" } }
          },
          {
            $lookup:
            {
              from: "productItems",
              localField: "idStr",
              foreignField: "categories",
              as: "productItems"
            }
          },
          {
            $project:
            {
              categoryName: 1,
              shopId: 1,
              parentCategoryId: 1,
              code: 1,
              productItemCounts: { $ifNull: [{ $size: "$productItems" }, 0] }
            }
          }
        ]
      this.categoriesManager.classInfo.mongoGetAggregate = pipeList;
      this.categoriesManager.classInfo.mongoCollectionName = 'categories';
      this.categoriesManager.search(null).then((httpStatus: HttpStatus<Array<Categories>>) => {
        this.categoriesManager.classInfo.mongoGetAggregate = null;
        resolve(httpStatus);
      }).catch((err) => {
        this.categoriesManager.classInfo.mongoGetAggregate = null;
        PickdyLogHelper.error('SERVICE-CategoryService-getAllCategoryAndProductItemCount ' + JSON.stringify(err) + ' --data --' + JSON.stringify(pipeList));
        reject(HttpStatus.getHttpStatus(err));
      });
    });
    return promise;
  }
}