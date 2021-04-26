import IAppAttachments from "../base/interfaces/IAppAttachments";
// import WebSocketHelper from "./helpers/WebSocketServer";

class AppConfig {
  private static app: Array<string> = null;
  public static appAttachments: IAppAttachments = null;

  constructor() {
    //this.LoadConfiguration();
    if (AppConfig.app == null) AppConfig.app = new Array<string>();
  }
  /* GENERAL */
  public DEFAULT_NAMESPACE = "DEFAULT_NAMESPACE";
  public TIMEOUT = "TIMEOUT";
  public MAX_REQUEST_BODY = "MAX_REQUEST_BODY";
  /* CACHE_ON */
  public CACHE_ON = "CACHE_ON";

  /* REDIS */
  public REDIS_HOST = "REDIS_HOST";
  public REDIS_DATABASE = "REDIS_DATABASE";

  /* POSTGRES */
  public POSTGRES_USERNAME = "POSTGRES_USERNAME";
  public POSTGRES_PASSWORD = "POSTGRES_PASSWORD";
  public POSTGRES_HOST = "POSTGRES_HOST";
  public POSTGRES_DATABASE = "POSTGRES_DATABASE";
  public POSTGRES_OPTIONS = "POSTGRES_OPTIONS";
  public POSTGRES_POOLSIZE = "POSTGRES_POOLSIZE";

  /* MONGO CONFIG  */
  public MONGO_USERNAME = "MONGO_USERNAME";
  public MONGO_PASSWORD = "MONGO_PASSWORD";
  public MONGO_HOST = "MONGO_HOST";
  public MONGO_DATABASE = "MONGO_DATABASE";
  public MONGO_OPTIONS = "MONGO_OPTIONS";
  public MONGO_POOLSIZE = "MONGO_POOLSIZE";

  /* HOST CONFIG  */
  public PORTAL_HOST = "PORTAL_HOST";
  public PICKDY_HOST = "PICKDY_HOST";

  /* REST CONFIG  */
  public REST_API_HOST = "REST_API_HOST";
  public REST_API_USERNAME = "REST_API_USERNAME";
  public REST_API_PASSWORD = "REST_API_PASSWORD";
  public TGN_COMMON = "tgn.common";
  public PERSISTANCE_DEFAULT = "PERSISTANCE_DEFAULT";

  public AUTH0_AUDIENCE_SECRETS = "AUTH0_AUDIENCE_SECRETS";
  public AUTH0_APP_SECRET = "AUTH0_APP_SECRET";
  public AUTH0_APP_CLIENT_ID = "AUTH0_APP_CLIENT_ID";
  public AUTH0_DOMAIN = "AUTH0_DOMAIN";
  public AUTH0_CLIENT_PUBLIC_KEY = "AUTH0_CLIENT_PUBLIC_KEY";
  public AUTH0_CLIENT_ID = "AUTH0_CLIENT_ID";
  public CLIENT_AUTH0_DOMAIN = "CLIENT_AUTH0_DOMAIN";
  public GOOGLE_API_KEY = "GOOGLE_API_KEY";

  /* SMS CONFIG  */
  public TWILIO_ACCOUNT_ID = "TWILIO_ACCOUNT_ID";
  public TWILIO_AUTH_TOKEN = "TWILIO_AUTH_TOKEN";
  public TWILIO_PHONE_NUMBER = "TWILIO_PHONE_NUMBER";

  /* MAIL CONFIG  */
  public MESSAGE_HOST = "MESSAGE_HOST";
  public MESSAGE_PORT = "MESSAGE_PORT";
  public MESSAGE_FROM_ADDRESS = "MESSAGE_FROM_ADDRESS";
  public MESSAGE_FROM_NAME = "MESSAGE_FROM_NAME";
  public MESSAGE_ENCRYPTION = "MESSAGE_ENCRYPTION";
  public MESSAGE_PASSWORD = "MESSAGE_PASSWORD";
  public TGN_ADMIN_EMAIL = "TGN_ADMIN_EMAIL";

  /* STRIPE CONFIG */
  public STRIPE_API_KEY = "STRIPE_API_KEY";
  public STRIPE_API_SECRET = "STRIPE_API_SECRET";
  public STRIPE_WEBHOOK_SECRET = "STRIPE_WEBHOOK_SECRET";
  public STRIPE_WEBHOOK_END_POINT_SECRET = "STRIPE_WEBHOOK_END_POINT_SECRET";
  public STRIPE_DEFAULT_PLAN = "STRIPE_DEFAULT_PLAN";
  public STRIPE_CONNECT_CLIENT_ID = "STRIPE_CONNECT_CLIENT_ID";

  /* DOSHII */
  public DOSHII_CLIENT_ID = "DOSHII_CLIENT_ID";
  public DOSHII_CLIENT_REST_URI = "DOSHII_CLIENT_REST_URI";
  public DOSHII_CLIENT_SECRET = "DOSHII_CLIENT_SECRET";
  public DOSHII_CLIENT_URI = "DOSHII_CLIENT_URI";
  public DOSHII_VERSION = "DOSHII_VERSION";
  public DOSHII_ENVIRONMENT = "DOSHII_ENVIRONMENT";

  /** Log4j */
  public LOG_SERVICE = "LOG_SERVICE";
  public LOG_FILE_NAME = "LOG_FILE_NAME";
  public LOG_LEVEL = "LOG_LEVEL";

  /** WEB_SOCKET */
  public WEB_SOCKET_HOST = "WEB_SOCKET_HOST";
  public WEB_SOCKET_PORT = "WEB_SOCKET_PORT";
  public DOSHII_LOCATION_ID = "DOSHII_LOCATION_ID";

  public CRYPT_IV = "CRYPT_IV";
  public CRYPT_KEY = "CRYPT_KEY";
  public LOGIN_URL = "LOGIN_URL";
  public WEB_HOST = "WEB_HOST";

  /* FIREBASE */
  public FIREBASE_CONFIG = "FIREBASE_CONFIG";
  public SOCKET_API_HOST = "SOCKET_API_HOST";

  /* SYNC SERVICE FOR WORKFORCE */
  public SYNC_SERVICE_HOST = "SYNC_SERVICE_HOST";

  /* AMAZON */
  public AMAZON_API_KEY = "AMAZON_API_KEY";
  public AMAZON_API_SECRET = "AMAZON_API_SECRET";
  public AMAZON_REGION = "AMAZON_REGION";
  public AMAZON_S3_BUCKET_NAME = "AMAZON_S3_BUCKET_NAME";
  public ENABLE_HYBRID = "ENABLE_HYBRID";

  public GetChildConfiguration(key: string): AppConfig { 
    let childAppConfig = new AppConfig();
    childAppConfig.LoadValues(childAppConfig, AppConfig.app[key]);
    childAppConfig.GetConfiguration = childAppConfig.GetChildConfig;
    return childAppConfig;
  }

  public LoadAttachments(appAttachments: IAppAttachments) {
    AppConfig.appAttachments = appAttachments;
    let appDispatcher = appAttachments.getAppDispatcher();
    if (appDispatcher) {
      appDispatcher.attachSocketEvents();
    }
  }

  private LoadValues(obj: any, configValues: any) {    
    // CACHE
    obj[this.CACHE_ON] = configValues[this.CACHE_ON];
    
    // REDIS CONFIG
    obj[this.REDIS_HOST] = configValues[this.REDIS_HOST];
    obj[this.REDIS_DATABASE] = configValues[this.REDIS_DATABASE];

    // POSTGRES CONFIG
    obj[this.POSTGRES_USERNAME] = configValues[this.POSTGRES_USERNAME];
    obj[this.POSTGRES_PASSWORD] = configValues[this.POSTGRES_PASSWORD];
    obj[this.POSTGRES_HOST] = configValues[this.POSTGRES_HOST];
    obj[this.POSTGRES_DATABASE] = configValues[this.POSTGRES_DATABASE];
    obj[this.POSTGRES_OPTIONS] = configValues[this.POSTGRES_OPTIONS];
    obj[this.POSTGRES_POOLSIZE] = configValues[this.POSTGRES_POOLSIZE];

    // MONGO CONFIG
    obj[this.MONGO_USERNAME] = configValues[this.MONGO_USERNAME];
    obj[this.MONGO_PASSWORD] = configValues[this.MONGO_PASSWORD];
    obj[this.MONGO_HOST] = configValues[this.MONGO_HOST];
    obj[this.MONGO_DATABASE] = configValues[this.MONGO_DATABASE];
    obj[this.MONGO_OPTIONS] = configValues[this.MONGO_OPTIONS];
    obj[this.MONGO_POOLSIZE] = configValues[this.MONGO_POOLSIZE];
    
    // WEB CONFIG
    obj[this.WEB_HOST] = configValues[this.WEB_HOST];
    obj[this.TIMEOUT] = configValues[this.TIMEOUT];
    obj[this.MAX_REQUEST_BODY] = configValues[this.MAX_REQUEST_BODY];

    // HOST CONFIG
    obj[this.PORTAL_HOST] = configValues[this.PORTAL_HOST];
    obj[this.PICKDY_HOST] = configValues[this.PICKDY_HOST];

    // REST CONFIG
    obj[this.REST_API_HOST] = configValues[this.REST_API_HOST];
    obj[this.REST_API_USERNAME] = configValues[this.REST_API_USERNAME];
    obj[this.REST_API_PASSWORD] = configValues[this.REST_API_PASSWORD];
    obj[this.TGN_COMMON] = configValues[this.TGN_COMMON];
    obj[this.GOOGLE_API_KEY] = configValues[this.GOOGLE_API_KEY];   
    //PERSISTANCE ENGINE.
    obj[this.PERSISTANCE_DEFAULT] = configValues[this.PERSISTANCE_DEFAULT];

    //AUTH0
    obj[this.AUTH0_APP_SECRET] = configValues[this.AUTH0_APP_SECRET];
    obj[this.AUTH0_AUDIENCE_SECRETS] =
      configValues[this.AUTH0_AUDIENCE_SECRETS];
    obj[this.AUTH0_APP_CLIENT_ID] = configValues[this.AUTH0_APP_CLIENT_ID];
    obj[this.AUTH0_DOMAIN] = configValues[this.AUTH0_DOMAIN];
    obj[this.AUTH0_CLIENT_PUBLIC_KEY] =
      configValues[this.AUTH0_CLIENT_PUBLIC_KEY];
    obj[this.CLIENT_AUTH0_DOMAIN] = configValues[this.CLIENT_AUTH0_DOMAIN];

    //STRIPE
    obj[this.STRIPE_API_SECRET] = configValues[this.STRIPE_API_SECRET];
    obj[this.STRIPE_API_KEY] = configValues[this.STRIPE_API_KEY];
    obj[this.STRIPE_WEBHOOK_SECRET] = configValues[this.STRIPE_WEBHOOK_SECRET];
    obj[this.STRIPE_WEBHOOK_END_POINT_SECRET] =
      configValues[this.STRIPE_WEBHOOK_END_POINT_SECRET];
    obj[this.STRIPE_DEFAULT_PLAN] = configValues[this.STRIPE_DEFAULT_PLAN];
    obj[this.STRIPE_CONNECT_CLIENT_ID] =
      configValues[this.STRIPE_CONNECT_CLIENT_ID];

    //CRYPT
    obj[this.CRYPT_IV] = configValues[this.CRYPT_IV];
    obj[this.CRYPT_KEY] = configValues[this.CRYPT_KEY];

    //SMS
    obj[this.TWILIO_ACCOUNT_ID] = configValues[this.TWILIO_ACCOUNT_ID];
    obj[this.TWILIO_AUTH_TOKEN] = configValues[this.TWILIO_AUTH_TOKEN];
    obj[this.TWILIO_PHONE_NUMBER] = configValues[this.TWILIO_PHONE_NUMBER];

    //MESSAGING
    obj[this.MESSAGE_ENCRYPTION] = configValues[this.MESSAGE_ENCRYPTION];
    obj[this.MESSAGE_HOST] = configValues[this.MESSAGE_HOST];
    obj[this.MESSAGE_PORT] = configValues[this.MESSAGE_PORT];
    obj[this.MESSAGE_PASSWORD] = configValues[this.MESSAGE_PASSWORD];
    obj[this.MESSAGE_FROM_NAME] = configValues[this.MESSAGE_FROM_NAME];
    obj[this.MESSAGE_FROM_ADDRESS] = configValues[this.MESSAGE_FROM_ADDRESS];

    //FIREBASE
    obj[this.FIREBASE_CONFIG] = configValues[this.FIREBASE_CONFIG];

    //KITCHEN MONITOR SOCKET
    obj[this.SOCKET_API_HOST] = configValues[this.SOCKET_API_HOST];

    //LOG
    obj[this.LOG_SERVICE] = configValues[this.LOG_SERVICE];
    obj[this.LOG_FILE_NAME] = configValues[this.LOG_FILE_NAME];
    obj[this.LOG_LEVEL] = configValues[this.LOG_LEVEL];

    AppConfig[this.LOGIN_URL] = configValues[this.LOGIN_URL];

    //DOSHII
    obj[this.DOSHII_CLIENT_ID] = configValues[this.DOSHII_CLIENT_ID];
    obj[this.DOSHII_CLIENT_REST_URI] =
      configValues[this.DOSHII_CLIENT_REST_URI];
    obj[this.DOSHII_CLIENT_SECRET] = configValues[this.DOSHII_CLIENT_SECRET];
    obj[this.DOSHII_CLIENT_URI] = configValues[this.DOSHII_CLIENT_URI];
    obj[this.DOSHII_VERSION] = configValues[this.DOSHII_VERSION];
    obj[this.DOSHII_ENVIRONMENT] = configValues[this.DOSHII_ENVIRONMENT];
    obj[this.WEB_SOCKET_HOST] = configValues[this.WEB_SOCKET_HOST];
    obj[this.WEB_SOCKET_PORT] = configValues[this.WEB_SOCKET_PORT];
    obj[this.DOSHII_LOCATION_ID] = configValues[this.DOSHII_LOCATION_ID];

    /* SYNC SERVICE FOR WORKFORCE */
    obj[this.SYNC_SERVICE_HOST] = configValues[this.SYNC_SERVICE_HOST];

    //AMAZON
    obj[this.AMAZON_API_KEY] = configValues[this.AMAZON_API_KEY];
    obj[this.AMAZON_API_SECRET] = configValues[this.AMAZON_API_SECRET];
    obj[this.AMAZON_REGION] = configValues[this.AMAZON_REGION];
    obj[this.AMAZON_S3_BUCKET_NAME] = configValues[this.AMAZON_S3_BUCKET_NAME];
    obj[this.ENABLE_HYBRID] = configValues[this.ENABLE_HYBRID];
  }
  public getEnvironmentName(environment: any = null): string {
    const environmentNameDefault = "dev";
    let environmentName: string;
    if (environment == null) {
      // API
      environmentName = process.env.ENVIRONMENT;
      if (environmentName == null || environmentName == "")
        environmentName = environmentNameDefault;
    } else {
      // UI
      environmentName =
        environment && environment.name
          ? environment.name
          : environmentNameDefault;
    }
    return environmentName;
  }
  public LoadConfiguration(
    appConfigurationOptions: any,
    environment: any = null
  ) {
    let environmentName = this.getEnvironmentName(environment);

    let configValues = appConfigurationOptions[environmentName];
    this.LoadValues(AppConfig, configValues);
    AppConfig.app = configValues;

    // SHARED OPTIONS THAT ARE THE SAME REGARDLESS OF ENVIRONMENT BUT ARE NOT CONSTANTS.
    var sharedConfiguration = appConfigurationOptions["shared_configuration"];

    if (sharedConfiguration) {
      AppConfig[this.DEFAULT_NAMESPACE] =
        sharedConfiguration[this.DEFAULT_NAMESPACE];
      AppConfig[this.REDIS_DATABASE] = sharedConfiguration[this.REDIS_DATABASE];     
    }
  }

  public GetAppAttachments(): IAppAttachments {
    return AppConfig.appAttachments;
  }

  public GetConfiguration(key: string): any {
    return AppConfig[key];
  }

  public GetChildConfig(key: string): any {
    return this[key];
  }
}

var AppConfiguration = new AppConfig();
export default AppConfiguration;
