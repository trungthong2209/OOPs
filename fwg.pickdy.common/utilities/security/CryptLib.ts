import AppConfig from '../AppConfig';

declare var require: any;

export default class Crypt {

    public static encrypt(text : string): string{
        var CryptLib = require('cryptlib')
        let iv =  AppConfig.GetConfiguration(AppConfig.CRYPT_IV);
        let textkey =  AppConfig.GetConfiguration(AppConfig.CRYPT_KEY);
        let key = CryptLib.getHashSha256(textkey, 31); //32 bytes = 256 bits
        
        return CryptLib.encrypt(text, key, iv);
    }

    public static decrypt(text : string): string{
        var CryptLib = require('cryptlib')
        let iv = AppConfig.GetConfiguration(AppConfig.CRYPT_IV);
        let textkey =  AppConfig.GetConfiguration(AppConfig.CRYPT_KEY);
        let key = CryptLib.getHashSha256(textkey, 31); //32 bytes = 256 bits
        
        return CryptLib.decrypt(text, key, iv);
    }
  
}
