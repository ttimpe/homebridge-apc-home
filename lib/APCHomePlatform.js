"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PLUGIN_NAME = "homebridge-apc-home";
const PLATFORM_NAME = "APCHome";
let hap;
let Accessory;
class APCHomePlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.log = log;
        this.config = config;
        this.api = api;
        api.on('didFinishLaunching', () => {
            this.didFinishLaunching();
        });
    }
    didFinishLaunching() {
    }
    configureAccessory(accessory) {
    }
}
exports.default = APCHomePlatform;
