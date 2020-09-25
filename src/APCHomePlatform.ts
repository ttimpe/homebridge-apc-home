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
} from "homebridge"


import APCHomeAccessory from './APCHomeAccessory'

const PLUGIN_NAME = "homebridge-apc-home"
const PLATFORM_NAME = "APCHome"

let hap: HAP
let Accessory: typeof PlatformAccessory


export default class APCHomePlatform implements DynamicPlatformPlugin {


}