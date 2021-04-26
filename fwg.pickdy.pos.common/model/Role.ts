import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import ICachable from "../../fwg.pickdy.common/base/interfaces/ICachable";
// import DataAccess from './DataAccess';
// import Application from './Application';
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";

export default class Role extends BaseEntity<Role> implements ICachable {
  public name: string;
  public code: string;
  public applicationId: string;
  public dataAccessIds: Array<string>;
  public level: number;
  public description: string;

  // @IgnoreDecorator.ignoreInDb()
  // public application: Application;
  // @IgnoreDecorator.ignoreInDb()
  // public dataAccesses: Array<DataAccess>;

  constructor() {
    super();
    // this.dataAccesses = new Array<DataAccess>();
    // this.application = new Application();
    // this.dataAccessIds = new Array<string>();
  }

  public assign(obj: any) {
    if (obj == null) return;
    this._id = obj._id;
    this.name = obj.name;
    this.code = obj.code;
    this.level = obj.level;
    this.description = obj.description;
    this.applicationId = obj.applicationId;
    this.dataAccessIds = obj.dataAccessIds;
    // this.application.assign(obj.application);

    // for (let i = 0; i < this.arrayLength(obj.dataAccesses); i++) {
    //     let a = new DataAccess();
    //     a.assign(obj.dataAccesses[i]);
    //     this.dataAccesses.push(a);
    // }
  }
}
