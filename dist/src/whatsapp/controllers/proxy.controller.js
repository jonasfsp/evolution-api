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
exports.ProxyController = void 0;
const logger_config_1 = require("../../config/logger.config");
const logger = new logger_config_1.Logger('ProxyController');
class ProxyController {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    createProxy(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested createProxy from ' + instance.instanceName + ' instance');
            if (!data.enabled) {
                logger.verbose('proxy disabled');
                data.proxy = '';
            }
            return this.proxyService.create(instance, data);
        });
    }
    findProxy(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findProxy from ' + instance.instanceName + ' instance');
            return this.proxyService.find(instance);
        });
    }
}
exports.ProxyController = ProxyController;
