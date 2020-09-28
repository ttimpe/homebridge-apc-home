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
import APCDevice from './APCDevice'

const PLUGIN_NAME = "homebridge-apc-home"
const PLATFORM_NAME = "APCHome"

let hap: HAP
let Accessory: typeof PlatformAccessory


export default class APCHomePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  public apcService: APCService

  public accessories: PlatformAccessory[] = []

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

  async didFinishLaunching() {
    this.apcService = new APCService()
    if (this.config.email && this.config.password) {
      let email = this.config.email.toString()
      let password = this.config.password.toString()
       await this.apcService.loginUser(email, password)
       let apcDevices: APCDevice[] = await this.apcService.getDevices()
      // Now make platform accessories out of those devices, check if they already exist, etc.

        for (var i=0; i<apcDevices.length; i++) {
          const uuid = this.api.hap.uuid.generate('homebridge-apc-home' + apcDevices[i].dsn)

          const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid)

          if (existingAccessory) {
            this.log.info('Restoring accessory')

          } else {
            let accessory = new this.api.platformAccessory(apcDevices[i].product_name, uuid)
            let apcAccessory = new APCHomeAccessory(this, accessory, this.config, this.log, apcDevices[i])
            this.log.info('Created new accessory with name', apcDevices[i].product_name)
            this.api.registerPlatformAccessories(PLUGIN_NAME,PLATFORM_NAME,[accessory])
          }

        }
    }
  }

  configureAccessory(accessory: PlatformAccessory) {

  }

}