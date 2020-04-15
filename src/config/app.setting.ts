import { ConfigManager } from './config.manager';
import { Environment } from './environment';

export class AppSetting {

    public static Env = Environment.Prod;

    public static getConfig() {
        const configManager = new ConfigManager();
        return configManager.Config;
    }
}
