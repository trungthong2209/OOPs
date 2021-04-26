// import Message from '../../model/Message';
import AppConfiguration from '../AppConfig';
import User from '../../model/User';
import UserManager from '../../model/manager/UserManager';
import Guid from '../../model/Guid';
import BaseHelper from '../../base/BaseHelper';
import BaseObj from '../../base/BaseObj';

const HEARTBEAT_INTERVAL = 10000;
const REFRESH_IS_REQUIRED = 60;

export class ConnectionInfo{
    public nameSpace:string;
    public user: User;
    public location: Location;
    public mongoCollections: Array<string>;
    public idToken: string;
    public terminalIdentifier: string;
    public socketIdentifier: string;
    public criteria: any;

    constructor(suffix: string = null) {
        this.mongoCollections = new  Array<string>();
        if(this.hasLocalStorage()){
            if(sessionStorage.getItem("guid") == null) {
                sessionStorage.setItem("guid", Guid.newGuid());
            }
            let socketConnections = 1;
            if(sessionStorage.getItem("socketConnections") != null) {
                socketConnections = parseInt(sessionStorage.getItem("socketConnections"))  + 1;
            }
            sessionStorage.setItem("socketConnections", socketConnections.toString());
            this.terminalIdentifier = localStorage.getItem("guid"); 
            this.socketIdentifier = sessionStorage.getItem("guid");
           
            if (suffix)
                this.socketIdentifier = this.socketIdentifier + "." + suffix;
        }
    }

    private hasLocalStorage():boolean{
        try{
            sessionStorage.setItem("hasLocalStorage", "test");
            sessionStorage.removeItem("hasLocalStorage");
            return true;
        }
        catch(e){
            return false;
        }
    }

}

export class SocketMessage{
    type:string;
    guid:Guid; 
    data:any;

    constructor(type: string, data:any) {
        this.type = type;
        this.data = data;
        if(sessionStorage){
            this.guid = sessionStorage.getItem("guid");
            if(this.guid == null){
                let guid =  Guid.newGuid();
                sessionStorage.setItem("guid", guid)
                this.guid = guid;
            }

        }
    }
}

export default class WebSocketClientHelper {
    
    private clientMessageHandler: Array<any>;
    private websocket: WebSocket;
    private messageHandlers: Array<any>;
    private userManager: UserManager;
    public connectionInfo:ConnectionInfo;
    private user: User;
    public isConnected: boolean;
    public isRecieving: boolean;
    private lastPing :  number;
    private _enabled: boolean;
    private socketTimeOutFunction: any;
    private socketReconnectedFunction: any;
    private socketRefusedConnectionFunction: any;
    private heartbeatInterval: NodeJS.Timer;
    private onPingFunction: Function;

    constructor(suffix: string = null, socketTimeOutFunction: any = null, criteria: any = null, socketReconnectedFunction: any = null, socketRefusedConnectionFunction: any = null) {
        this.socketTimeOutFunction = socketTimeOutFunction;
        this.socketReconnectedFunction = socketReconnectedFunction;
        this.socketRefusedConnectionFunction = socketRefusedConnectionFunction;
        console.log("__WEBSOCKET");
        this.messageHandlers = new Array<any>(); //todo remove.
        this.clientMessageHandler = new Array<any>();
        this.userManager = new UserManager(null);
        this.connectionInfo = new ConnectionInfo(suffix);
        this.connectionInfo.user = this.user = this.userManager.getItemLocalStorage();
        this.connectionInfo.criteria = criteria;
        this.isConnected = false;
        this.isRecieving = false;
        this._enabled = true;
    }

    public get criteria() : any{
        return this.connectionInfo.criteria;
    }
    
    public set criteria(value:any){
        this.connectionInfo.criteria = value;
    }

    public get enabled(): boolean{
        return this._enabled;
    }

    public set enabled(value:boolean){
        this._enabled = value;
        if (value){
            this.Initialise();
        }
        else{
            this.disable();
        }
    } 

    public addClientMessageHandler<T extends BaseObj>(helper: BaseHelper<T>){
        this.clientMessageHandler.push(helper);
    }

    private disable(){
        this.websocket.close();     
    }

     
    /**
     * Connect this instance of the UI to the API via a websocket. Also initialises the UI->API heartbeat.
     */
    public Initialise()
    {        
        this.user = this.userManager.getItemLocalStorage();
        this.connectionInfo.nameSpace = AppConfiguration.GetConfiguration(AppConfiguration.DEFAULT_NAMESPACE);
        this.connectionInfo.idToken =  localStorage.getItem('id_token');
        var wsUri = AppConfiguration.GetConfiguration(AppConfiguration.SOCKET_API_HOST);
        try {
            this.websocket = new WebSocket(wsUri);
        }
        catch(err) {
            console.log("Cannot reach socket server: " + JSON.stringify(err));
        }
        let self = this;
        this.websocket.onopen = (evt) => { 
            this.OnOpen(evt);
        };
        this.websocket.onclose = (evt) => { 
            this.OnClose(evt);
        };
        this.websocket.onmessage = (evt) => { 
            this.OnMessage(evt);        
        };
        this.websocket.onerror = (evt) => { 
            this.OnError(evt)
        };
        //send a heartbeat to the web socket server.
        if(this.heartbeatInterval == null) {
            console.log("Creating new heartbeat...");
            this.heartbeatInterval = setInterval(() => {
                this.Heartbeat(this.websocket);
                }, HEARTBEAT_INTERVAL);
        }        
    }

    public AddMessageHandler(newHandler: any) {
        this.messageHandlers.push(newHandler);
    }


    public addHelperHandler<T extends BaseObj>(helper: BaseHelper<T>){
        this.clientMessageHandler.push(helper);
    }


    private OnMessage(data: MessageEvent) {
        this.isRecieving = true;
        let message = JSON.parse(data.data);
        //console.log("WS received: " + data.data);
        
        
        this.lastPing = new Date().getTime() / 1000;
        switch(message.type) {
            case "ping":
                this.websocket.send(JSON.stringify({
                    "guid": sessionStorage.getItem("guid"),
                    "type": "pong"
                }));
                if(this.onPingFunction){
                    this.onPingFunction(message);
                }
            break;
            case "pong":
                //do nothing
            break;
            case "ack":
                //do nothing.
            break;

            case "order_Reload":
                console.log("WS received: " + JSON.stringify(message));
            break;
        
            default:
                this.sendEventToHandlers(message);
        }
        setTimeout(() => {this.isRecieving = false}, 1000);    
    
    }

    private sendEventToHandlers(message){
        this.clientMessageHandler.forEach((handler => {
            handler.handleAllClientSocketEvent(message);
        }));
        message.type = "ack";      
        this.sendMessage(message);
    }


    public sendMessage(data: any) {
        let jsonData = JSON.stringify(data);
        //console.log("Sending message to API over websocket: ", jsonData);
        this.websocket.send(jsonData);
    }

    private OnClose(data: CloseEvent) {
        this.isConnected = false;
        console.log("WS closed: " + data.code + " " + data.reason);  
    }

    private OnOpen(data: Event) {
        console.log("WS opened: " + JSON.stringify(data));
        this.openConnection();
    }

    private openConnection(){
        if (this.sinceLastPing() > 0 && this.socketReconnectedFunction){
            this.socketReconnectedFunction();
        }
        let message = new SocketMessage("establish_connection", this.connectionInfo);
        console.log("WS sent: " + JSON.stringify(message));        
        this.websocket.send(JSON.stringify(message));
        this.isConnected = true;
    }

    private OnError(data: Event) {
        console.log("WS error: " + data.type);
        this.socketRefusedConnectionFunction();
    }

    private sinceLastPing():number {
        let now = new Date().getTime() / 1000;
        return now  - this.lastPing;
    }

    private Heartbeat(socket: WebSocket) {
        try{
            if (this.sinceLastPing() > (HEARTBEAT_INTERVAL * 3) && this._enabled){ // if we have missed 3 pings
                console.log("WARNING: WEBSOCKET HEARTBEAT TIME HAS TIMED OUT - Attempting to re-establish connection...");
                this.Initialise();
            }
            else if(socket.readyState === socket.OPEN) {
                //console.log("WS heartbeat");
                let message = JSON.stringify({
                    "guid": sessionStorage.getItem("guid"),
                    "type": "ping",
                    "data": {
                        "socketIdentifier" : this.connectionInfo.socketIdentifier
                    }
                });
                
                socket.send(message);
            }
            else if(this._enabled){
                console.log("WebSocket has been closed for "+Math.floor(this.sinceLastPing())+" sec, attemping to re-establish connection...");
                this.Initialise();
            }
        
            if (this.socketTimeOutFunction && this.sinceLastPing() > REFRESH_IS_REQUIRED ){
                this.socketTimeOutFunction();
            }

        }
        catch(e){
            console.log(e);
        }
    }
    public addEventListenerOnPing(onPingFunction){
        this.onPingFunction = onPingFunction;
    }
}
