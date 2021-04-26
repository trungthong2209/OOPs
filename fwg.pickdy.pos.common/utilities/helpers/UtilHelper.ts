export default class UtilHelpers {
    /**
     * common function for round number to many digits after decimal depend on digitsNumber
     * @param amount 
     * @param digitNumber default is 2
     */
    public static roundNumber(amount: number, digitNumber?: number): number {
        if (!digitNumber) {
            digitNumber = 2;
        }
        return Math.round(amount * Math.pow(10, digitNumber)) / Math.pow(10, digitNumber);
    }

    /**
     * convert data url of image to buffer array
     * @param dataURI      
     */
    public static convertDataURIToBinary(dataURI) {
        let base64Marker = ';base64,',
            base64Index = dataURI.indexOf(base64Marker) + base64Marker.length,
            base64 = dataURI.substring(base64Index),
            raw = window.atob(base64),
            rawLength = raw.length,
            array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    /**
     * Get table list from table
     * @param table table number
     */
    public static getTableList(table: string): Array<number> {
        if (table) {
            let tableStr: string = table + '';
            while (tableStr.indexOf(',') >= 0) {
                tableStr = tableStr.replace(',', '/');
            } 
            if(tableStr.length > 0){
                return tableStr.split('/').map(item => +item).filter((item, pos, arr) => item > 0 && arr.indexOf(item) === pos);
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
}

