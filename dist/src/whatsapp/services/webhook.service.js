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
exports.WebhookService = void 0;
const logger_config_1 = require("../../config/logger.config");
class WebhookService {
    constructor(waMonitor) {
        this.waMonitor = waMonitor;
        this.logger = new logger_config_1.Logger(WebhookService.name);
    }
    create(instance, data) {
        this.logger.verbose('create webhook: ' + instance.instanceName);
        this.waMonitor.waInstances[instance.instanceName].setWebhook(data);
        return { webhook: Object.assign(Object.assign({}, instance), { webhook: data }) };
    }
    find(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('find webhook: ' + instance.instanceName);
                const result = yield this.waMonitor.waInstances[instance.instanceName].findWebhook();
                if (Object.keys(result).length === 0) {
                    throw new Error('Webhook not found');
                }
                return result;
            }
            catch (error) {
                return { enabled: false, url: '', events: [], webhook_by_events: false };
            }
        });
    }
}
exports.WebhookService = WebhookService;
