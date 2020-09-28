"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.log = log;
        this.config = config;
        this.api = api;
        api.on('didFinishLaunching', () => {
            this.didFinishLaunching();
        });
    }
    async didFinishLaunching() {
        this.apcService = new APCService_1.default();
        if (this.config.email && this.config.password) {
            let email = this.config.email.toString();
            let password = this.config.password.toString();
            await this.apcService.loginUser(email, password);
            let apcDevices = await this.apcService.getDevices();
            // Now make platform accessories out of those devices, check if they already exist, etc.
        }
    }
    configureAccessory(accessory) {
    }
}
exports.default = APCHomePlatform;
