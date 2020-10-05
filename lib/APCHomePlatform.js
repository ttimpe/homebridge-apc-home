"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APCHomeAccessory_1 = __importDefault(require("./APCHomeAccessory"));
const APCService_1 = __importDefault(require("./APCService"));
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
        this.accessories = [];
        this.apcAccessories = [];
        this.apcDevices = [];
        this.log = log;
        this.config = config;
        this.api = api;
        api.on('didFinishLaunching', () => {
            this.didFinishLaunching();
        });
    }
    configureAccessory(accessory) {
        this.log.info('Loading accessory from cache:', accessory.displayName);
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this.accessories.push(accessory);
    }
    async didFinishLaunching() {
        this.log.info("APCHome initialized");
        this.apcService = new APCService_1.default();
        if (this.config.email && this.config.password) {
            let email = this.config.email.toString();
            let password = this.config.password.toString();
            this.log.info("Logging in user");
            await this.apcService.loginUser(email, password);
            let apcDevices = await this.apcService.getDevices();
            // Now make platform accessories out of those devices, check if they already exist, etc.
            for (var i = 0; i < apcDevices.length; i++) {
                const uuid = this.api.hap.uuid.generate('homebridge-apc-home-' + apcDevices[i].dsn);
                this.log.info("Existing accessories", this.accessories);
                const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
                this.log.info("existingAccessory value", existingAccessory);
                if (existingAccessory) {
                    this.log.info('Restoring accessory');
                    let apcAccessory = new APCHomeAccessory_1.default(this, existingAccessory, this.config, this.log, apcDevices[i], this.apcService);
                    this.apcAccessories.push(apcAccessory);
                    this.api.updatePlatformAccessories([existingAccessory]);
                }
                else {
                    this.log.info("Creating new accessory");
                    let accessory = new this.api.platformAccessory(apcDevices[i].product_name, uuid);
                    let apcAccessory = new APCHomeAccessory_1.default(this, accessory, this.config, this.log, apcDevices[i], this.apcService);
                    this.log.info('Created new accessory with name', apcDevices[i].product_name);
                    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
                    this.apcAccessories.push(apcAccessory);
                }
            }
            setInterval(this.updateValues, 10000);
        }
    }
    async updateValues() {
        console.log("Called updateValues");
        try {
            for (var dev = 0; dev < this.apcDevices.length; dev++) {
                let updatedOutlets = await this.apcService.getDeviceProperties(this.apcDevices[dev]);
                console.log('updated outlets', updatedOutlets);
                for (var i = 0; i < this.apcDevices[dev].outlets.length; i++) {
                    for (var j = 0; j < updatedOutlets.length; j++) {
                        if (this.apcDevices[dev].outlets[i].id == updatedOutlets[j].id) {
                            this.apcDevices[dev].outlets[i].isOn = updatedOutlets[j].isOn;
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log('Error while updateValues', error);
        }
    }
}
exports.default = APCHomePlatform;
