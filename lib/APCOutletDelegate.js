"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APCOutletDelegate {
    constructor(platform, log, outlet, apcService, service) {
        this.platform = platform;
        this.log = log;
        this.outlet = outlet;
        this.apcService = apcService;
        this.service = service;
        this.log = log;
        this.outlet = outlet;
        this.apcService = apcService;
        this.service = service;
        this.Service = this.platform.api.hap.Service;
        this.Characteristic = this.platform.api.hap.Characteristic;
        service.getCharacteristic(this.Characteristic.On)
            .on('get', this.handleOnGet.bind(this))
            .on('set', this.handleOnSet.bind(this));
        service.getCharacteristic(this.Characteristic.OutletInUse)
            .on('get', this.handleOutletInUseGet.bind(this));
    }
    /**
       * Handle requests to get the current value of the "On" characteristic
       */
    handleOnGet(callback) {
        this.log.info('Triggered GET On');
        // set this to a valid value for On
        callback(null, this.outlet.isOn);
    }
    /**
     * Handle requests to set the "On" characteristic
     */
    handleOnSet(value, callback) {
        this.log.info('Triggered SET On:', value);
        callback(null);
        const boolValue = !!value;
        this.apcService.setPowerState(this.outlet, boolValue);
    }
    /**
     * Handle requests to get the current value of the "Outlet In Use" characteristic
     */
    handleOutletInUseGet(callback) {
        this.log.info('Triggered GET OutletInUse');
        // set this to a valid value for OutletInUse
        callback(null, 1);
    }
}
exports.default = APCOutletDelegate;
