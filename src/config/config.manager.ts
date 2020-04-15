import { AppSetting } from './app.setting';
import { DevConfig } from './config.dev';
import { ProdConfig } from './config.prod';
import { Environment } from './environment';

export class ConfigManager {
  public Config;
  constructor() {
    switch (AppSetting.Env) {
      case Environment.Dev:
        this.Config = DevConfig;
        break;
      case Environment.Prod:
        this.Config = ProdConfig;
        break;
      default:
        this.Config = DevConfig;
    }
  }
}
