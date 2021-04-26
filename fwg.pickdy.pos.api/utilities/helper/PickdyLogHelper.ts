import log4js = require('log4js');
const logger = log4js.getLogger('Pickdy')

export default class PickdyLogHelper {
    public static LOG_SERVICE = 'log4j';
    public static LOG_FILE_NAME = '/appl/server_api/logs/pos.log';
    public static LOG_LEVEL = 'debug';
    /**
     * Init configuration for Log Helper
     */
    public static initLogConfiguration(): void {
        let logService = this.LOG_SERVICE,
            logFileName = this.LOG_FILE_NAME,
            logLevel = this.LOG_LEVEL;

        log4js.configure({
            appenders: {
                Pickdy: {
                    type: 'dateFile',
                    filename: logFileName,
                    pattern: '-yyyy-MM-dd',
                    alwaysIncludePattern: true
                }
            },
            categories: {
                default: {
                    appenders: ['Pickdy'],
                    level: logLevel
                }
            }
        });
    }
    /**
     * Loger at level error
     * @param err :  Error information
     */
    public static error(err: any): void {
        logger.error(err);
    }
    /**
     * Loger at level trace
     * @param err :  Error information
     */
    public static trace(err: any): void {
        logger.trace(err);
    }
    /**
     * Loger at level info
     * @param err :  Error information
     */
    public static info(err: any): void {
        logger.info(err);
    }
    /**
      * Loger at level warm
      * @param err :  Error information
      */
    public static warn(err: any): void {
        logger.warn(err);
    }
    /**
     * Loger at level fatal
     * @param err :  Error information
     */
    public static fatal(err: any): void {
        logger.fatal(err);
    }


}