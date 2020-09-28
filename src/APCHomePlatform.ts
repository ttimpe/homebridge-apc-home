import {
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  Characteristic,
  HAP,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  PlatformConfig,
  Categories,
  Service
} from "homebridge"


import APCHomeAccessory from './APCHomeAccessory'
import APCService from './APCService'

const PLUGIN_NAME = "homebridge-apc-home"
const PLATFORM_NAME = "APCHome"

let hap: HAP
let Accessory: typeof PlatformAccessory


export default class APCHomePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  constructor(
    public readonly log: Logging,
    public readonly config: PlatformConfig,
    public readonly api : API) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', () => {
      this.didFinishLaunching();
    })

  }

  didFinishLaunching() {

  }

  configureAccessory(accessory: PlatformAccessory) {

  }

}