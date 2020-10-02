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
  public apcAccessories: APCHomeAccessory[] = []
  public apcDevices: APCDevice[] = []

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
    this.log.info("APCHome initialized")
    this.apcService = new APCService()
    if (this.config.email && this.config.password) {
      let email = this.config.email.toString()
      let password = this.config.password.toString()
      this.log.info("Logging in user")
       await this.apcService.loginUser(email, password)
       let apcDevices: APCDevice[] = await this.apcService.getDevices()
      // Now make platform accessories out of those devices, check if they already exist, etc.

        for (var i=0; i<apcDevices.length; i++) {
          const uuid = this.api.hap.uuid.generate('homebridge-apc-home' + apcDevices[i].dsn)
          this.log.info("Existing accessories", this.accessories)
          const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid)
          this.log.info("existingAccessory value", existingAccessory)
          if (existingAccessory) {
            this.log.info('Restoring accessory')
            let apcAccessory = new APCHomeAccessory(this, existingAccessory, this.config, this.log, apcDevices[i], this.apcService)
            this.apcAccessories.push(apcAccessory)

          } else {
            this.log.info("Creating new accessory")
            
            let accessory = new this.api.platformAccessory(apcDevices[i].product_name, uuid)
            let apcAccessory = new APCHomeAccessory(this, accessory, this.config, this.log, apcDevices[i], this.apcService)
            this.log.info('Created new accessory with name', apcDevices[i].product_name)
            this.api.registerPlatformAccessories(PLUGIN_NAME,PLATFORM_NAME,[accessory])
            this.apcAccessories.push(apcAccessory)
          }

        }
       setInterval(this.updateValues, 5000)
    }

  }

  configureAccessory(accessory: PlatformAccessory) {

  }
  async updateValues() {
    this.log.info("Called updateValues")
    for (var dev=0; dev<this.apcDevices.length; dev++) {
      let updatedOutlets = await this.apcService.getDeviceProperties(this.apcDevices[dev])
      for (var i=0; i<this.apcDevices[dev].outlets.length; i++) {
        for (var j=0; j<updatedOutlets.length; j++) {
          if (this.apcDevices[dev].outlets[i].id == updatedOutlets[j].id) {
            this.apcDevices[dev].outlets[i].isOn = updatedOutlets[j].isOn
          }
        }
      }
    }
  }
}