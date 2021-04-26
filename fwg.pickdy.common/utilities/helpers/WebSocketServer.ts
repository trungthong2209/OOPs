const ServerSocket = require('ws');
import AppConfiguration from '../AppConfig';
import Guid from '../../model/Guid';
import MongoDB from './MongoDb';
import {ConnectionInfo} from './WebSocketClientHelper';
import SecurityEnforcer from '../security/SecurityEnforcer';


const HEARTBEAT_INTERVAL = 5000;
const TIMEOUT  = 70000;//One minute and a bit.

class UniqueCallback {
    guid: Guid;
    callback: any;
    constructor(fn: any) {
        this.callback = fn;
        this.guid = Guid.newGuid();
    }
}

export class SocketConnection {
    constructor() {
        this.connectionInfo = new ConnectionInfo();
    }

    public socket: any;
    public connectionInfo: ConnectionInfo;
    public socketIdentifier: string;
}

class SocketMessage {
    public type: string;
    public data: any;
    public callback: string; //string name of function on UI side to be called.
    public guid: Guid;
    public socketIdentifier: string;
    public criteria: any;
   

    static fromString(dataString: string): SocketMessage {        
        let data = JSON.parse(dataString);
        let sm = new SocketMessage();
        sm.type = data.type;
        sm.data = data.data;
        sm.callback = data.callback;
        sm.guid = data.guid;
   
        return sm;
    }
}

class WebSocketHelper {

    //Active websocket connections
    public connections: Array<SocketConnection>;
    private callbacks: Array<UniqueCallback>;
    protected httpsServer: any;
    protected socketServer: any;
    private interval: any;
    ///functions containing a SocketConnection  and args array 
    ///EXAMPLE fn(SocketConnection: SocketConnection, args: Array<any>)
    public onSocketConnect: Array<any>;
    public onSocketClose: Array<any>;
    public onSocketDataReceive: Array<any>;
    public onSocketDataSend: Array<any>;
    
    constructor() {
        this.connections = new Array<SocketConnection>();
        this.callbacks = new Array<UniqueCallback>();
        
        this.onSocketConnect = new Array<any>();
        this.onSocketClose = new Array<any>();
        this.onSocketDataReceive = new Array<any>();
        this.onSocketDataSend = new Array<any>();
    }
    
    private excuteActionEvents(functions: Array<any>, connection: SocketConnection, args: Array<any>){
        if (functions){
            for (let i = 0; i < functions.length; i++) {
                let fn = functions[i];
                fn(connection, args);  
            }
        }
    }

    /**
     * Initialises a singleton websocket server.
     * @param httpsServer 
     */
    public Initialise(httpsServer: any) {
        console.log("Initialising new WebSocket server...");
        this.StartHeartbeat();
        this.httpsServer = httpsServer;
        this.httpsServer.listen(AppConfiguration.GetConfiguration(AppConfiguration.SOCKET_API_HOST).split(":")[2], () => {
            console.log('WebSocket server Listening on %d', this.httpsServer.address().port);
        });
        this.socketServer = new ServerSocket.Server({ server: httpsServer });       
        //this.socketServer = new ServerSocket.Server({ server: newServer });       
        this.socketServer.on('connection', (ws) => {                     
            ws.isAlive = true;
            ws.on('message', (messageString) => {
                this.ReceiveMessage(SocketMessage.fromString(messageString), ws);
            });
            ws.on('close', (code: number, reason: string) => {
                this.ConnectionClosed(ws, code, reason);
            });
        });
    }

    private  StartHeartbeat   () {
        this.interval = setInterval(()=> {
            if(this.connections.length == 0 || this.socketServer == undefined) {
                return;
            }
            let liveConnections = this.connections.filter(x => x.socket.isAlive == true);
            //console.log("Performing heartbeat on " + liveConnections.length + " clients.");

            this.connections.forEach((connection ) => {
                if (connection.socket.isAlive === false) 
                    return connection.socket.terminate();

                connection.socket.isAlive = false;
                try{
                    connection.socket.send(JSON.stringify({
                        "type": "ping",
                        "socketIdentifier": connection.socketIdentifier,
                        "callback": "foo"
                    }));
                }
                catch(e){
                    console.log("Connection has closed.");
                }
            });
        }, HEARTBEAT_INTERVAL);
    }

    private heartbeat(ws: any) {
        ws.isAlive = true;
    }

    /**
     * Send an arbitrary payload to all connections with corresponding locationId. Data should be a string OR a JSON object.
     * @param data 
     * @param locationId 
     */
    public SendReloadOrder(data: any, shopId: string) {       
        this.connections.forEach((connection) => {               
            if(connection.connectionInfo.criteria === shopId) {                
                let sendData : any = {};
                sendData.token = shopId;
                sendData.type = "order_Reload";
                sendData.data = data;
                let stringifiedData = JSON.stringify(sendData);                          
                connection.socket.send(stringifiedData);
            }
        });
    }

    public SendData(data: any, connections: Array<SocketConnection>, callback: string, fn: any) {
        let cb = new UniqueCallback(fn);
        this.callbacks.push(cb);
        let sendData : any = {};
        sendData.type = "ui message";
        sendData.data = data;
        sendData.callback = callback;
        connections.forEach((connection) => {
            try{
                sendData.guid = connection.socketIdentifier;
                let stringifiedData = JSON.stringify(sendData);
                if(data && data.mongoCollectionName && data.mongoCollectionName=="orders") { //todo: remove this.
                    console.log("Order " + data.id + " has been modified.");
                }
                connection.socket.send(stringifiedData);

                this.excuteActionEvents(this.onSocketDataSend, connection, [sendData]);
            }
            catch(e){
                console.log("Connection has closed.");
            }
        });
    }

    private getConnection(socketIdentifier:string): SocketConnection{
        let connection  = this.connections.find(x =>x.socketIdentifier == socketIdentifier);
        return connection;
    }

    private ReceiveMessage(message: SocketMessage, ws: any) {
        this.heartbeat(ws);
        switch(message.type){
            case "establish_connection":
                this.EstablishConnect(message, ws);
            break;
            case "ping":
                this.HandlePing(message, ws);
            break;
            case "pong":
                this.HandlePong(message, ws);
            break;
            case "ack":
                this.Ack(message, ws);
                break;
            default:
                let connection = this.getConnection(message.socketIdentifier);
                this.excuteActionEvents(this.onSocketDataReceive,  connection, [message]);
        }
        if(message.guid) {
            let cb = this.callbacks.find((x) => x.guid === message.guid);
            if(cb != undefined) {
                cb.callback();
                this.callbacks = this.callbacks.filter((x) => x.guid != cb.guid);
            }            
        }      
    }

    private EstablishConnect(message: SocketMessage, ws: any) { //todo get auth0 token in and check it. 
        if(!message.hasOwnProperty('guid')) {
            ws.close(1000, "Permission denied");
            return;
        }
        console.log('EstablishConnect EstablishConnect '+JSON.stringify(message));
        let existingConnection = this.connections.filter(connection => connection.socketIdentifier == message.data.socketIdentifier);
        /*if(existingConnection.length > 0 && existingConnection[0].socket.isAlive == true) {
            ws.send(JSON.stringify({
                "type": "ack",
                "guid": message.guid,
                "data": "Client already exists."
            }));
        }*/
        //else {
            let newConnection = new SocketConnection();
            newConnection.socket = ws;
            
            newConnection.socketIdentifier =  message.data.socketIdentifier;
            if(message.data) {
                newConnection.connectionInfo.user = message.data.user;
                newConnection.connectionInfo.nameSpace = message.data.nameSpace;
                newConnection.connectionInfo.location = message.data.location;
                newConnection.connectionInfo.mongoCollections =  message.data.mongoCollections;
                newConnection.connectionInfo.idToken =  message.data.idToken;
                newConnection.connectionInfo.terminalIdentifier =  message.data.terminalIdentifier;
                newConnection.connectionInfo.criteria = message.data.criteria;
               
               /* if (SecurityEnforcer.checkToken(newConnection.connectionInfo.idToken,  message.data.user ) == false){
                    ws.close(1000, "Permission denied");
                    return;
                }*/
               

                this.excuteActionEvents(this.onSocketConnect, newConnection, [message]);
            }      

            //Remove the old one. SHOULD HAVE MUTEX HERE.
            let connectionIndex = this.connections.findIndex(connection => connection.socketIdentifier == message.data.socketIdentifier);
            if (connectionIndex >= 0)
                this.connections.splice(connectionIndex, 1)

            this.connections.push(newConnection);

            ws.send(JSON.stringify({
                "type": "ack",
                "guid": message.guid,
                "data": "new client."
            }));
        //}
    }

    private ReconnectFromPing(message: SocketMessage, ws: any): boolean {
        if(!this.CheckAuthorised(message, ws)) return false;
        
        let existingConnection = this.connections.filter(connection => connection.socketIdentifier == message.data.socketIdentifier);
        if(existingConnection == null || existingConnection.length == 0) {
            let newConnection = new SocketConnection();
            newConnection.socket = ws;
            newConnection.socketIdentifier =  message.data.socketIdentifier;
            if(message.data) {
                newConnection.connectionInfo.user = message.data.user;
                newConnection.connectionInfo.nameSpace = message.data.nameSpace;
                newConnection.connectionInfo.location = message.data.location;
                newConnection.connectionInfo.mongoCollections =  message.data.mongoCollections;
                newConnection.connectionInfo.idToken =  message.data.idToken;
                newConnection.connectionInfo.terminalIdentifier =  message.data.terminalIdentifier;
                newConnection.connectionInfo.criteria = message.data.criteria;
               
                
                this.excuteActionEvents(this.onSocketConnect, newConnection, [message]);
            }
            //Remove the old one. SHOULD HAVE MUTEX HERE.
            let connectionIndex = this.connections.findIndex(connection => connection.socketIdentifier == message.data.socketIdentifier);
            if (connectionIndex >= 0)
                this.connections.splice(connectionIndex, 1)
            this.connections.push(newConnection);
        }
        return true;
    }
    
    private HandlePing(data: SocketMessage, ws: any) {
        if(!this.ReconnectFromPing(data, ws)) return;
        ws.send(JSON.stringify({
            "guid": data.guid,
            "type": "pong"
        }));
    }

    private HandlePong(data: SocketMessage, ws: any) {
        if(!this.CheckAuthorised(data, ws)) return;
        ws.send(JSON.stringify({
            "guid": data.guid,
            "type": "ack"
        }));
    }
    /**
     * An Ack is an acknowledgement that the previous message was received. 
     * @param data 
     * @param ws 
     */
    private Ack(msg: any, ws: any) {
        if (msg != null && msg.data != null)
            if(msg.data.msgId != null)
                MongoDB.queueAck(msg.data);
            else if(msg.data.queueId != null)
                MongoDB.queuePreAck(msg.data);
    }

    private ConnectionClosed(ws: any, code: number, reason: string) {
        setTimeout(() => {
            console.log("CLOSED CONNECTION " + code + " " + reason);
            let connection =  this.connections.find(x => x.socket._closeCode == ws._closeCode);
            this.excuteActionEvents(this.onSocketClose, connection, [code, reason]);
            this.connections = this.connections.filter(connection => connection.socket._closeCode != ws._closeCode);
            ws.close(code, reason);
        }, TIMEOUT); //Messages will  only be sent to the queue for 70 seconds.
    }

    /**
     * Do not process socket messages that do not have auth tokens, and immediately close the connection. Returns whether token is valid.
     * TODO proper auth checks of valid tokens.
     * @param data 
     * @param ws 
     */
    private CheckAuthorised(message: SocketMessage, ws: any): boolean {
        
        let connection = this.connections.find(connection => connection.socketIdentifier == message.socketIdentifier);
        if (connection && SecurityEnforcer.checkToken(connection.connectionInfo.idToken, message.data.idToken ) == false){
            ws.close(1000, "Permission denied");
            return false;
        }
        
        return true;
    }
}
    let WebSocketServer =new WebSocketHelper();
export default WebSocketServer;
