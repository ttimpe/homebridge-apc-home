"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APCHomeAccessory {
    constructor(platform, accessory, config, log, deviceId) {
        this.platform = platform;
        this.accessory = accessory;
        this.config = config;
        this.log = log;
        this.deviceId = deviceId;
        this.enabledServices = [];
        this.name = 'APC Smart Plug';
        this.platform = platform;
        this.log = platform.log;
        this.deviceId = deviceId;
        this.Service = this.platform.api.hap.Service;
        this.Characteristic = this.platform.api.hap.Characteristic;
    }
}
exports.default = APCHomeAccessory;
