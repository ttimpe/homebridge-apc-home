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
		private device: APCDevice
		) {
		this.platform = platform;
		this.log = platform.log;

		this.device = device

		this.Service = this.platform.api.hap.Service

		this.Characteristic = this.platform.api.hap.Characteristic

		this.device = device


		this.accessory.getService(this.platform.Service.AccessoryInformation)!
		.setCharacteristic(this.platform.Characteristic.Manufacturer, 'APC')
		.setCharacteristic(this.platform.Characteristic.FirmwareRevision, 'FIRMWARE')
		.setCharacteristic(this.platform.Characteristic.Model, this.device.model)
		.setCharacteristic(this.platform.Characteristic.SerialNumber, this.device.dsn.toString())

		for (let i=0; i < this.device.outlets.length; i++) {
			const uuid = this.platform.api.hap.uuid.generate('homebridge-apc-home-' + this.device.outlets[i].id)
			let service = this.accessory.addService(this.platform.Service.Outlet, this.device.outlets[i].name, this.device.outlets[i].name)
   		service.getCharacteristic(this.Characteristic.On)
        		.on('get', this.handleOnGet.bind(this))
       		    .on('set', this.handleOnSet.bind(this));

      		service.getCharacteristic(this.Characteristic.OutletInUse)
        		.on('get', this.handleOutletInUseGet.bind(this));

			this.enabledServices.push(service)
		}
		
	}


  /**
   * Handle requests to get the current value of the "On" characteristic
   */
  handleOnGet(callback: CharacteristicGetCallback) {
    this.log.debug('Triggered GET On');

    // set this to a valid value for On
    

    callback(null, 1);
  }

  /**
   * Handle requests to set the "On" characteristic
   */
  handleOnSet(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    this.log.debug('Triggered SET On:', value);

    callback(null);
  }

  /**
   * Handle requests to get the current value of the "Outlet In Use" characteristic
   */
  handleOutletInUseGet(callback: CharacteristicGetCallback) {
    this.log.debug('Triggered GET OutletInUse');

    // set this to a valid value for OutletInUse
    const currentValue = 1;

    callback(null, currentValue);
  }

}
