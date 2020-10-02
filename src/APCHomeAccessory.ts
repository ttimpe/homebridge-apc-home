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
import APCDevice from './APCDevice'
import APCOutlet from './APCOutlet'
import APCOutletDelegate from './APCOutletDelegate'
import APCService from './APCService'

export default class APCHomeAccessory {
	private Service: any
	private Characteristic: any



	private enabledServices: Service[] = []
	private name: string = 'APC Smart Plug'

	constructor(
		private readonly platform: APCHomePlatform,
		private readonly accessory: PlatformAccessory,
		private readonly config: any,
		private readonly log: Logging,
		private device: APCDevice,
		private apcService: APCService
		) {
		this.platform = platform;
		this.log = platform.log;

		this.device = device

		this.Service = this.platform.api.hap.Service

		this.Characteristic = this.platform.api.hap.Characteristic

		this.log.info("Init device ", device)

		this.accessory.getService(this.platform.Service.AccessoryInformation)!
		.setCharacteristic(this.platform.Characteristic.Manufacturer, 'APC')
		.setCharacteristic(this.platform.Characteristic.FirmwareRevision, 'FIRMWARE')
		.setCharacteristic(this.platform.Characteristic.Model, this.device.model)
		.setCharacteristic(this.platform.Characteristic.SerialNumber, this.device.dsn.toString())

		for (let i=0; i < this.device.outlets.length; i++) {
			const uuid = this.platform.api.hap.uuid.generate('homebridge-apc-home-' + this.device.outlets[i].id)
			var service = this.accessory.getService(this.device.outlets[i].name) || this.accessory.addService(this.platform.Service.Outlet, this.device.outlets[i].name, this.device.outlets[i].name)
			let outletDelegate = new APCOutletDelegate(this.platform, this.log, this.device.outlets[i], this.apcService, service)

			this.enabledServices.push(service)

			}
	}
	getServices() {
		return this.enabledServices
	}

}
