"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const logger_config_1 = require("../../config/logger.config");
const logger = new logger_config_1.Logger('SettingsController');
class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    createSettings(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested createSettings from ' + instance.instanceName + ' instance');
            return this.settingsService.create(instance, data);
        });
    }
    findSettings(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findSettings from ' + instance.instanceName + ' instance');
            return this.settingsService.find(instance);
        });
    }
}
exports.SettingsController = SettingsController;
