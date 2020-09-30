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

import APCOutlet from './APCOutlet'
import APCService from './APCService'

export default class APCOutletDelegate {

	private Service: any
	private Characteristic: any


	constructor(private readonly log: Logging, private readonly outlet: APCOutlet, private readonly apcService: APCService, private readonly service: Service) {
		

		this.log = log
		this.outlet = outlet
		this.apcService = apcService
		this.service = service


   		service.getCharacteristic(this.Characteristic.On)
        		.on('get', this.handleOnGet.bind(this))
       		  .on('set', this.handleOnSet.bind(this));
      service.getCharacteristic(this.Characteristic.OutletInUse)
        		.on('get', this.handleOutletInUseGet.bind(this));
	}
/**
   * Handle requests to get the current value of the "On" characteristic
   */
  handleOnGet(callback: CharacteristicGetCallback) {
    this.log.debug('Triggered GET On');

    // set this to a valid value for On
    
    callback(null, this.outlet.isOn)
  }

  /**
   * Handle requests to set the "On" characteristic
   */
  handleOnSet(value: any, callback: any) {
    this.log.debug('Triggered SET On:', value);

    callback(null);
    const boolValue :boolean = !!value
    this.apcService.setPowerState(this.outlet, boolValue)
  }

  /**
   * Handle requests to get the current value of the "Outlet In Use" characteristic
   */
  handleOutletInUseGet(callback: CharacteristicGetCallback) {
    this.log.debug('Triggered GET OutletInUse');

    // set this to a valid value for OutletInUse

    callback(null, 1);
  }


}