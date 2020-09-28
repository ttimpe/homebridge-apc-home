"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let axios = require('axios');
const APCOutlet_1 = __importDefault(require("./APCOutlet"));
class APCService {
    constructor() {
        this.app_id = 'alya-api-browser-id';
        this.app_secret = 'alya-api-browser-2tFsUL41FELUlyfrSMEZ4kNKwJg';
        this.access_token = '';
        this.refresh_token = '';
        this.client = axios.create();
    }
    async loginUser(email, password) {
        const url = 'https://user-field.aylantworks.com/users/sign_in.json';
        const loginObject = {
            "user": {
                "email": email,
                "password": password,
                "application": {
                    "app_id": "alya-api-browser-id",
                    "app_secret": "alya-api-browser-2tFsUL41FELUlyfrSMEZ4kNKwJg"
                }
            }
        };
        try {
            const res = await this.client.post(url, loginObject);
            if (res.status == 200) {
                this.access_token = res.data.access_token;
                this.refresh_token = res.data.refresh_token;
                return true;
            }
            else {
                return false;
            }
        }
        catch (_a) {
            return false;
        }
    }
    async getDevices() {
        let devices = [];
        const url = 'https://ads-field.aylantworks.com/apiv1/devices.json';
        try {
            const res = await this.client.get(url, {
                headers: {
                    'Authorization': 'auth_token ' + this.access_token
                }
            });
            if (res.status == 200) {
                for (let i = 0; i < res.data.length; i++) {
                    let device = res.data[i].device;
                    device.outlets = await this.getDeviceProperties(device);
                    devices.push(device);
                }
            }
        }
        catch (error) {
            console.log('[APCHome] error while fetching devices', error);
            return devices;
        }
        return devices;
    }
    async getDeviceProperties(device) {
        let outlets = [];
        const url = 'https://ads-field.aylantworks.com/apiv1/dsns/' + device.dsn + '/properties.json';
        try {
            const res = await this.client.get(url, {
                headers: {
                    'Authorization': 'auth_token ' + this.access_token
                }
            });
            if (res.status == 200) {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].property.name.substring(0, 6) == 'outlet' || res.data[i].property.name.substring(0, 3) == 'usb') {
                        let outlet = new APCOutlet_1.default();
                        outlet.id = res.data[i].property.key;
                        outlet.name = res.data[i].property.display_name;
                        outlet.isOn = res.data[i].property.value;
                        outlets.push(outlet);
                    }
                }
            }
        }
        catch (error) {
            console.log('[APCHome] error while getting device properties', error);
            return outlets;
        }
        return outlets;
    }
    async setPowerState(outlet, powerState) {
        const url = 'https://ads-field.aylanetworks.com/apiv1/properties/' + outlet.id + '/datapoints.json';
        const powerStateObject = {
            datapoint: {
                value: (!!powerState)
            }
        };
        try {
            const res = await this.client.post(url, powerStateObject, {
                headers: {
                    'Authorization': 'auth_token ' + this.access_token
                }
            });
            if (res.state == 200) {
                return true;
            }
        }
        catch (_a) {
            return false;
        }
        return false;
    }
}
exports.default = APCService;
