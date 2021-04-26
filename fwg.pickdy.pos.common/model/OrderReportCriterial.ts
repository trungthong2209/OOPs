export default class OrderReportCriterial {
    orderNumber: string = null;    
    fromDate: string = null;  
    toDate: string = null;  
    fromTime: string = '00:00';  
    toTime: string = '23:59';  
    staffId: string = null;  
    payment: string = null; 
    serviceType: string = null;
    status: string = null;  
    statusList: Array<string> = null;   
    staffIdList: Array<string> = null;
    paymentList: Array<string> = null; 
    serviceTypeList: Array<string> = null;      
}