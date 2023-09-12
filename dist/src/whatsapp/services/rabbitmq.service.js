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
exports.RabbitmqService = void 0;
const logger_config_1 = require("../../config/logger.config");
class RabbitmqService {
    constructor(waMonitor) {
        this.waMonitor = waMonitor;
        this.logger = new logger_config_1.Logger(RabbitmqService.name);
    }
    create(instance, data) {
        this.logger.verbose('create rabbitmq: ' + instance.instanceName);
        this.waMonitor.waInstances[instance.instanceName].setRabbitmq(data);
        return { rabbitmq: Object.assign(Object.assign({}, instance), { rabbitmq: data }) };
    }
    find(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('find rabbitmq: ' + instance.instanceName);
                const result = yield this.waMonitor.waInstances[instance.instanceName].findRabbitmq();
                if (Object.keys(result).length === 0) {
                    throw new Error('Rabbitmq not found');
                }
                return result;
            }
            catch (error) {
                return { enabled: false, events: [] };
            }
        });
    }
}
exports.RabbitmqService = RabbitmqService;
