import BaseEntity from "../../fwg.pickdy.common/base/BaseEntity";

export default class Guests extends BaseEntity<Guests>{
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    phone: string = "";
    shopId: string = null;
    constructor() {
      super();
    }
  
    public assign(obj: any){
        this._id = obj._id;
        this.firstName = obj.hasOwnProperty("firstName") ? obj.firstName : this.firstName;
        this.lastName = obj.hasOwnProperty("lastName") ? obj.lastName : this.lastName;
        this.email = obj.hasOwnProperty("email") ? obj.email : this.email;
        this.phone = obj.hasOwnProperty("phone") ? obj.phone : this.phone;
        this.shopId = obj.hasOwnProperty("shopId") ? obj.shopId : this.shopId;
    }

    public static newInstance(): Guests {
      let result = new Guests();
      return result;
    }
}