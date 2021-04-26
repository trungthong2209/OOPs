export default class DepositRules {
  productItemId : string;
  productName : string;
  quantity : number;  
  priceOrder : number;
  cancel : boolean = false;
  comment:string='';
  priceName:string='';
  deletedReason: string;
  deletedTime: Date;
}
