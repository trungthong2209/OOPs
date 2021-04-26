interface ICachable {
    //uniqueIdentifiers: Array<string>;
    getUniqueIdentifiers(): Array<string>;
    cacheOn: boolean;

    //this will be the field name of the unique identifier. In mongo it likely be _id in postgress or others it could be anything. 
    //uniqueIdentifierFieldName: string;

    //This will be the objects unique identifier. i.e. the value of _id... NOTE: as a string!
    //uniqueIdentifierValue: string;
}

export default ICachable;

 // export default  IPersistance;

