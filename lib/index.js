"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const APCHomePlatform_1 = __importDefault(require("./APCHomePlatform"));
module.exports = (api) => {
    api.registerPlatform("homebridge-apc-home", "APCHome", APCHomePlatform_1.default);
};
