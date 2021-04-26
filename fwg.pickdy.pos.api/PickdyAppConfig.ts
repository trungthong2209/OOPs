class PickdyAppConfig {
  private static app: Array<string> = null;

  constructor() {}
  INTERCOM_SECRET: string = "INTERCOM_SECRET";
  public GetChildConfiguration(key: string): PickdyAppConfig {    
    let childAppConfig = new PickdyAppConfig();
    childAppConfig.LoadValues(childAppConfig, PickdyAppConfig.app[key]);
    childAppConfig.GetConfiguration = childAppConfig.GetChildConfig;
    return childAppConfig;
  }

  private LoadValues(obj: any, configValues: any) {
    obj[this.INTERCOM_SECRET] = configValues[this.INTERCOM_SECRET];
  }

  public LoadConfiguration(
    appConfigurationOptions: any,
    environment: any = null
  ) {
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

    let configValues = appConfigurationOptions[environmentName];
    this.LoadValues(PickdyAppConfig, configValues);
    PickdyAppConfig.app = configValues;
  }

  public GetConfiguration(key: string): any {
    return PickdyAppConfig[key];
  }

  public GetChildConfig(key: string): any {
    return this[key];
  }
}

let PickdyAppConfiguration = new PickdyAppConfig();
export default PickdyAppConfiguration;
