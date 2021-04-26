import BaseObj from '../../base/BaseObj';
import AppConfig from '../AppConfig';
//import DispatcherManager from '../../model/managers/DispatcherManager';

export default class MongoDB extends BaseObj {
    private static mongoClient: any = null;
    private static mongodb: any = null;
    private static isConnected: boolean = false;
    private static  DISPATCHER_COLLECTION = "dispatchers"; 
    private static onConnectedFns: Array<any> = [];
    private static connectionString:string = null;
    private static queue: any = null;
    public static queueListeners: Array<any> = new Array<any>();
    public static hasQueueStarted= false;
    //public static connectedPromise: promise = new Promise();
    static get MongoClient(): any {
        if (MongoDB.mongoClient == null)
            MongoDB.init();

        return MongoDB.mongoClient;
    }

    static get MongoDB(): any {
        MongoDB.init();

        return MongoDB.mongodb;
    }

    constructor() {
        super();
        MongoDB.init();
        //MongoDB.queueListeners = new Array<any>();
    }

    public static init(withQueue: boolean = false) {
        if (MongoDB.mongoClient == null) {            
            MongoDB.mongoClient = require('mongodb').MongoClient;
            var username = AppConfig.GetConfiguration(AppConfig.MONGO_USERNAME);
            var password = AppConfig.GetConfiguration(AppConfig.MONGO_PASSWORD);
            var hosts = AppConfig.GetConfiguration(AppConfig.MONGO_HOST);
            var database = AppConfig.GetConfiguration(AppConfig.MONGO_DATABASE);
            var options = AppConfig.GetConfiguration(AppConfig.MONGO_OPTIONS);
            let poolSize = AppConfig.GetConfiguration(AppConfig.MONGO_POOLSIZE);
            var connectionString = 'mongodb://' + username + ':' + password + '@' + hosts;
            // + '/' + database + options
            if (undefined !== username && username.length ==  0){
                connectionString = 'mongodb://@' + hosts;
            }           
            MongoDB.connectionString = connectionString;
            //var MongoClient = require('mongodb').MongoClient;
            MongoDB.mongoClient.connect(connectionString,{ useNewUrlParser: true }, {
                poolSize: poolSize
            },  (err, db) => {
                if (!err) {                               
                    MongoDB.mongodb =  db.db(database);
                    MongoDB.connected();
                   // MongoDB.startDispatcher();
                    if (withQueue)
                        MongoDB.queueStart();
                    
                } else {
                    console.log("ERROR Connecting To Mongo Server");                 
                    throw err;
                }
            });

            
        }
    }

   //   --------------   MONGO QUEUE ------------------------
    private static queuePreAcks = new Array<any>();
    private static QUEUE_DELAY = -1;
    private static QUEUE_ATTEMPTS = 100*10; // times by 10 because runs 10th of a second
    private static QUEUE_CLEANUP_SCHEDULE = 60000; //EVERY MINUTE.
    public static  GET_INTERVAL = 1000; // not being used any more
    
    public static queueStart(queueListeners: Array<any>= null){
        if(MongoDB.queue)
            return;

        if (queueListeners)
            MongoDB.queueListeners = queueListeners;
            var mongoDbQueue = require('mongodb-queue');
            MongoDB.mongoClient.connect(MongoDB.connectionString, function(err, db) {
                let deadQueue = mongoDbQueue(db, 'deadQueue');
                MongoDB.queueHostname()
                .then((hostname:string) =>{
                    let queueName = 'queue_' + hostname;
                    MongoDB.queue = mongoDbQueue(db, queueName, { delay : MongoDB.QUEUE_DELAY, visibility : 1, deadQueue : deadQueue, maxRetries: MongoDB.QUEUE_ATTEMPTS });
                    MongoDB.queue.createIndexes(()=>{});
                    MongoDB.hasQueueStarted = true; 

                    setInterval(() => { MongoDB.queueClean();}, MongoDB.QUEUE_CLEANUP_SCHEDULE);
                });
        });
    }

    private static queueHostname():Promise<string> {
       let metadata = require('node-ec2-metadata');
       let promise: Promise<string> = new Promise((resolve, reject) => {
            metadata.isEC2()
            .then(function(onEC2) {
                if (onEC2){
                    metadata.getMetadataForInstance('instance-id')
                    .then(function(instanceId) {
                        if (instanceId)
                            resolve(instanceId);
                        else
                            resolve(MongoDB.getHostname());
                    })
                    .catch(()=>{
                        resolve(MongoDB.getHostname());
                    });
                }
                else{
                    resolve(MongoDB.getHostname());
                }
            });
       });
       return promise;
    }

    private static getHostname(){
        var os = require('os') ;
        let hostname = os.hostname();
        return hostname;
    }

    public static queueGet(callback){
        if(MongoDB.queue == null){
            callback();
            return;
        }
        MongoDB.queue.get((err, msg) => {
            if(msg){
                let queuePos = MongoDB.queuePreAcks.findIndex(x => x.queueId == msg.id);
                if (queuePos >= 0){
                    //the message has already been delivered
                    //delivery does not need to come from the queue. just notify of the hack.
                    msg.msgId = msg.ack;
                    MongoDB.queueAck(msg);
                    MongoDB.queuePreAcks.splice(queuePos,1);
                }
                else{
                    MongoDB.queueProcessGet(err, msg); 
                }
            }
            callback();
        });
    }

    public static queueProcessGet(err, msg){
        if (msg){
          
            for (let i = 0; i < MongoDB.queueListeners.length; i++) {
                var queueListener = MongoDB.queueListeners[i];
                queueListener(msg);
            }
        }
        if(err){
            console.log('err from queue' + err);
        }
    }

    public static queueAdd(obj: any):Promise<any>{
        let promise = new Promise((resolve, reject) => {
            if(MongoDB.queue == null){
                reject(Error("MongoDB.queue has not been started."));
            }
            else{ 
                    MongoDB.queue.add(obj , /* {maxRetries: MongoDB.QUEUE_ATTEMPTS }, */ function(err, id) {
                        if(err){                            
                            reject(err);
                        }                       
                        obj.queueId = id;
                        resolve(obj);
                    });
    }

        });
        return promise;
    }
   
    ///This message has been delivered and does not need delivery from the queue.
    public static queuePreAck(msg){
        MongoDB.queuePreAcks.push(msg);
    }

    public static queueAck(msg){
        if(MongoDB.queue == null)
            throw Error("MongoDB.queue has not been started.");

        MongoDB.queue.ack(msg.msgId, function(err, id) {
            if(err)
                console.log(err);           
        });
    }

    public static queueTotal(msg){
        if(MongoDB.queue == null)
            throw Error("MongoDB.queue has not been started.");

        MongoDB.queue.total(function(err, count) {           
            if(err)
                console.log(err);
        })
    }
   
    public static queueClean(){
        if(MongoDB.queue == null)
            throw Error("MongoDB.queue has not been started.");

        MongoDB.queue.clean(function(err) {            
            if(err)
                console.log(err);
        })
    }   

    public static onConnected(fn){
        if(MongoDB.isConnected){
            fn();
        }else{
            MongoDB.onConnectedFns.push(fn);
        }
    }

    private static connected(){
        MongoDB.isConnected = true;
        while(MongoDB.onConnectedFns.length > 0){
            MongoDB.onConnectedFns.shift()(); // removes the first element of the array and calls it
        }
    }
    public static listenToCollection(collection:string,conditions,callback) {
        // To set this up in mongo run db.createCollection('your_collection_name', {capped: true, size: 100000}) 
        // Create collection before running api's
        MongoDB.onConnected(()=>{
            let coll = MongoDB.MongoDB.collection(collection) 
            let latestCursor = coll.find(conditions).sort({$natural: -1}).limit(1)
            latestCursor.nextObject(function(err, latest) {
                if (latest  && latest._id != null) {
                    conditions._id = {$gt: latest._id}
                }
                let options = {
                    tailable: true,
                    await_data: true,
                    numberOfRetries: -1
                }
                //let stream = coll.find(conditions, options).sort({$natural: -1}).stream()
                let stream = coll.find(conditions, options).stream();
                stream.on('data', callback)
            })
        });
    }
}