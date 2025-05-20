import { AppConfig, UserSession } from '@stacks/auth';

const appConfig: AppConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession: UserSession = new UserSession({ appConfig });
