"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APCOutletDelegate_1 = __importDefault(require("./APCOutletDelegate"));
class APCHomeAccessory {
    constructor(platform, accessory, config, log, device, apcService) {
        this.platform = platform;
        this.accessory = accessory;
        this.config = config;
        this.log = log;
        this.device = device;
        this.apcService = apcService;
        this.enabledServices = [];
        this.name = 'APC Smart Plug';
        this.platform = platform;
        this.log = platform.log;
        this.device = device;
        this.Service = this.platform.api.hap.Service;
        this.Characteristic = this.platform.api.hap.Characteristic;
        this.log.info("Init device ", device);
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'APC')
            .setCharacteristic(this.platform.Characteristic.FirmwareRevision, 'FIRMWARE')
            .setCharacteristic(this.platform.Characteristic.Model, this.device.model)
            .setCharacteristic(this.platform.Characteristic.SerialNumber, this.device.dsn.toString());
        for (let i = 0; i < this.device.outlets.length; i++) {
            const uuid = this.platform.api.hap.uuid.generate('homebridge-apc-home-' + this.device.outlets[i].id);
            var service = this.accessory.getService(this.device.outlets[i].name) || this.accessory.addService(this.platform.Service.Outlet, this.device.outlets[i].name, this.device.outlets[i].name);
            let outletDelegate = new APCOutletDelegate_1.default(this.log, this.device.outlets[i], this.apcService, service);
            this.enabledServices.push(service);
        }
    }
    getServices() {
        return this.enabledServices;
    }
}
exports.default = APCHomeAccessory;
