import { API } from 'homebridge'
import APCHomePlatform from './APCHomePlatform'

export = (api: API) => {
  api.registerPlatform("homebridge-apc-home","APCHome", APCHomePlatform);
}
