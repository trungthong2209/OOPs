var AppConfigurationOptions = {
  dev: {    
    MONGO_USERNAME: "thangdang",
    MONGO_PASSWORD: "fwg_pos",
    MONGO_HOST: "157.245.51.171:27017",
    MONGO_DATABASE: "pickdy_coffee",
    MONGO_OPTIONS: "",
    MONGO_POOLSIZE: 10,
    PERSISTANCE_DEFAULT: "MONGO",
    REST_API_HOST: "http://157.245.51.171:3001",
    WEB_HOST: "http://157.245.51.171",
    // Log configuration
    LOG_SERVICE: "log4js",
    LOG_FILE_NAME: "logs/logs.log",
    LOG_LEVEL: "debug",

    // WEBSOCKET
    WEB_SOCKET_HOST: "ws://localhost",
    WEB_SOCKET_PORT: 5002,
    // Intercom
    INTERCOM_SECRET: "sP5qxs5lnVT5Ww4GFssWzLg_z2OB95opM5X3nGGI",
    CACHE_ON : false,
    CRYPT_IV:16,
    CRYPT_KEY:"fwg.pickdy.pos.common",
    AUTH0_APP_SECRET: "ygwrbMg64ryHEdgluNzayiky8xJZPUVUopJKL_KkXhQ4z5UDqXlrwBIpgCfEJXTC_Pickdy", 
    SOCKET_API_HOST : "ws://localhost:5003",
    /* NEVER TO GO TO UI !!! */
  },
  shared_configuration: {
        DEFAULT_NAMESPACE: 'fwg.pickdy.pos.common'
  }
};
export default AppConfigurationOptions;
