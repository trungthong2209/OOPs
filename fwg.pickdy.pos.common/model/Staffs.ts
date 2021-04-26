import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";
import IgnoreDecorator from "../../fwg.pickdy.common/utilities/ignore-helper/IgnoreDecorator";
import ValidationDecorator from "../../fwg.pickdy.common/utilities/validation/ValidationDecorator";
import Constants from "../../fwg.pickdy.pos.common/base/Constants";
import DataAccess from "../../fwg.pickdy.common/model/DataAccess";

export default class Staffs extends BaseEntity<Staffs> {
    @ValidationDecorator.required(Constants.SHOP_ID_REQUIRE)
    shopId: string;
    @ValidationDecorator.required(Constants.STAFFS.FULLNAME_REQUIRE)
    @ValidationDecorator.maxLength(Constants.STAFFS.FULLNAME_MAXLENGTH, Constants.STAFFS.FULLNAMEMAXLENGTH_VALUE)
    fullName: string;
    email: string;
    @ValidationDecorator.required(Constants.STAFFS.USERNAME_REQUIRE)
    @ValidationDecorator.minLength(Constants.STAFFS.USERNAME_MINLENGTH, Constants.STAFFS.USERNAME_MINLENGTH_VALUE)
    userName: string;
    @ValidationDecorator.required(Constants.STAFFS.PASSWORD_REQUIRE)
    @ValidationDecorator.minLength(Constants.STAFFS.PASSWORD_MINLENGTH, Constants.STAFFS.PASSWORD_MINLENGTH_VALUE)
    password: string = null;
    @IgnoreDecorator.ignoreInDb()
    @ValidationDecorator.compareString(Constants.STAFFS.CONFIRMPASSWORD_COMPARE, 'password', 'confirmPassword')
    confirmPassword: string = null;
    tel: number;
    @ValidationDecorator.required(Constants.STAFFS.ROLE_REQUIRE)   
    role: string;
    token:string= null;
    tokendevice:string= null;
    @IgnoreDecorator.ignoreInDb()
    dataAccess: Array<DataAccess>;
    createByUserId: string=null;    
    updateByUserId: string=null;    
    createDateTime: Date=null;    
    updateDateTime: Date=null;   
    ownerShop:boolean = false;
    @IgnoreDecorator.ignoreInDb()
    loginMode:string= "WEB";//WEB oR MOBILE
    constructor() {
      super();
      this.dataAccess = new Array<DataAccess>();
    }

    public assign(obj: any) {
      this._id = obj._id;
      this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
      this.fullName = obj.hasOwnProperty("fullName") ? obj.fullName : this.fullName;
      this.email = obj.hasOwnProperty("email") ? obj.email : this.email;
      this.userName = obj.hasOwnProperty("userName") ? obj.userName : this.userName;
      this.password = obj.hasOwnProperty("password") ? obj.password : this.password;
      this.role = obj.hasOwnProperty("role") ? obj.role : this.role;
      this.tel = obj.hasOwnProperty("tel") ? obj.tel : this.tel;
      this.token = obj.hasOwnProperty("token") ? obj.token : this.token;
      this.confirmPassword = obj.hasOwnProperty("confirmPassword") ? obj.confirmPassword : this.confirmPassword;
      this.dataAccess = obj.hasOwnProperty("dataAccess") ? obj.dataAccess : this.dataAccess;
      this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;  
      this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;  
      this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;  
      this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime; 
      this.ownerShop = obj.hasOwnProperty("ownerShop") ? obj.ownerShop : this.ownerShop; 
      this.tokendevice = obj.hasOwnProperty("tokendevice") ? obj.tokendevice : this.tokendevice; 
      this.loginMode = obj.hasOwnProperty("loginMode") ? obj.loginMode : this.loginMode; 
    }
    public static newInstance(): Staffs {
      let result = new Staffs();
      return result;
    }
}