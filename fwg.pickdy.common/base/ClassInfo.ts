import BaseObj from './BaseObj';
export default class ClassInfo extends BaseObj {
    /* GENERAL CLASS ATTRIBUTES  */
    public type: any;
    public nameSpace: string;

    public dbType: string; // mongo or postgres
    public cacheType: string // redis

    /*  MONGO CLASS ATTRIBUTES */
    public mongoCollectionName: string;
    public mongoGetQuery: string;
    public mongoGetAggregate: Array<any>;
    public mongoDeletQuery: string;
    public mongoUupdateQuery: string;
    public orm : any;

    /* REST API (CONSUMER) ATTRIBUTES */
    public endPoint: string;


    constructor() {
        super();
        this.mongoCollectionName = null;
        this.mongoGetQuery = null;
        this.mongoGetAggregate = null;
        this.mongoDeletQuery = null;
        this.mongoUupdateQuery = null; 
        this.orm = null;

    }


}