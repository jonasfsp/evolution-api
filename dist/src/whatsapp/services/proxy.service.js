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
exports.ProxyService = void 0;
const logger_config_1 = require("../../config/logger.config");
class ProxyService {
    constructor(waMonitor) {
        this.waMonitor = waMonitor;
        this.logger = new logger_config_1.Logger(ProxyService.name);
    }
    create(instance, data) {
        this.logger.verbose('create proxy: ' + instance.instanceName);
        this.waMonitor.waInstances[instance.instanceName].setProxy(data);
        return { proxy: Object.assign(Object.assign({}, instance), { proxy: data }) };
    }
    find(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('find proxy: ' + instance.instanceName);
                const result = yield this.waMonitor.waInstances[instance.instanceName].findProxy();
                if (Object.keys(result).length === 0) {
                    throw new Error('Proxy not found');
                }
                return result;
            }
            catch (error) {
                return { enabled: false, proxy: '' };
            }
        });
    }
}
exports.ProxyService = ProxyService;
