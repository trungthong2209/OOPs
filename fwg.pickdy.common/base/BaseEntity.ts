import  BaseObj  from './BaseObj';
export default class BaseEntity<T> extends BaseObj {    
    //@IgnoreDecorator.ignoreInDb()
    //public cacheOn: boolean = true;

    public get cacheOn(): boolean{
        return false; 
    }

    public set cacheOn(value: boolean){
    }

    public getUniqueIdentifiers(): any{
        return {
            "_id": this._id
        };
    } 

    public get isNew(): boolean{
        return (this._id == null || this._id == "")
    }

    public hasAllKeys( obj: any, additionalFields: Array<string> = null): boolean{
        return BaseEntity.hasAllKeys(this, obj, additionalFields);
    }

    public static hasAllKeys(source: any, obj: any, additionalFields: Array<string> = null): boolean{
        if(source == null) return true; //todo hack fix to bug where appDispatcher would send through null source.
        let specialKeys = ["$in","$or","$gt","$lt","_id"];
        let entityFields = BaseEntity.fieldNames(source);
        let objectFields = BaseEntity.objectFieldNames(obj);

        for (let i = 0; i < objectFields.length; i++) {
            let objectField = objectFields[i];
            if(entityFields.find ( x => x == objectField) == null){
                if(additionalFields == null || additionalFields.find ( y => y == objectField) == null){
                    if (specialKeys.find( z => z == objectField) == null){                        
                        let x  = BaseEntity.objectFieldNames(obj);
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public fieldNames():Array<string>{
        return BaseEntity.fieldNames(this);
    }

    public static fieldNames(source: any):Array<string>{
        if (source == null)
            return null;
        let fieldNames:Array<string> = BaseEntity.objectFieldNames(source);
        let __this: any  = source;
        if(__this.__validationRules){
            for (var i = 0; i < __this.__validationRules.length; i++) {
                var validationRule = __this.__validationRules[i];
                fieldNames.push(validationRule.propertyName);
            }
        }
        
        return fieldNames;
    }

    public static objectFieldNames(obj: any ):Array<string>{
        let fieldNames = new Array<string>();
        let strData = JSON.stringify(obj, (key, value) => BaseEntity.mapReplacer(key, value, fieldNames));
    
        return fieldNames;
    }
    
    
    private static mapReplacer(key, value, fieldNames){
        if(key != "" && isNaN(key) ){
            fieldNames.push(key);
        }

        return value;
    }


    constructor() {
        super();
    }
   
    /**
     * Generate a Object Id
     */
    public static newObjectId(): string {
        let objectStr = 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return objectStr;
    }

    public static hasChanged<T>(original: T, current: T): boolean {
        return original != current;
    }

    public newInstance(){
        return null; //new BaseEntity<T>(); //must be overriden as class is not constructed correctly currently in TS.
    }

    public assign(object: BaseEntity<T>){
        //must be overwritten in implmnenting class as TS does not currently do proper refection..     
    }

    public clone(): any {
        let newObject = this.newInstance();
        newObject.assign(this);
        return newObject ;
    }

    /**
     * Returns whether this is running on the UI or API.
     */
    public isUI(): boolean {
        return !(typeof window === 'undefined');
    }
}