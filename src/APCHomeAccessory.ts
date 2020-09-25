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
	Service,
	Categories
} from "homebridge";

import APCHomePlatform from './APCHomePlatform'
import APCOutlet from './APCOutlet'

export default class APCHomeAccessory {
	private Service: any
	private Characteristic: any



	private enabledServices: Service[] = []
	private name: string = 'APC Smart Plug'
	private deviceId: string = ''

	private outlets: APCOutlet[] = []
 
	constructor(
		private readonly platform: APCHomePlatform,
		private readonly accessory: PlatformAccessory,
		private readonly config: any,
		private readonly log: Logging
		private readonly deviceId: string
		)
		this.platform = platform;
		this.log = platform.log;

		this.deviceId = deviceId

		this.Service = this.platform.api.hap.Service

		this.Characteristic = this.platform.api.hap.Characteristic



}
