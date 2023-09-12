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
exports.ChatwootController = void 0;
const class_validator_1 = require("class-validator");
const logger_config_1 = require("../../config/logger.config");
const exceptions_1 = require("../../exceptions");
const chatwoot_service_1 = require("../services/chatwoot.service");
const whatsapp_module_1 = require("../whatsapp.module");
const logger = new logger_config_1.Logger('ChatwootController');
class ChatwootController {
    constructor(chatwootService, configService) {
        this.chatwootService = chatwootService;
        this.configService = configService;
    }
    createChatwoot(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested createChatwoot from ' + instance.instanceName + ' instance');
            if (data.enabled) {
                if (!(0, class_validator_1.isURL)(data.url, { require_tld: false })) {
                    throw new exceptions_1.BadRequestException('url is not valid');
                }
                if (!data.account_id) {
                    throw new exceptions_1.BadRequestException('account_id is required');
                }
                if (!data.token) {
                    throw new exceptions_1.BadRequestException('token is required');
                }
                if (data.sign_msg !== true && data.sign_msg !== false) {
                    throw new exceptions_1.BadRequestException('sign_msg is required');
                }
            }
            if (!data.enabled) {
                logger.verbose('chatwoot disabled');
                data.account_id = '';
                data.token = '';
                data.url = '';
                data.sign_msg = false;
                data.reopen_conversation = false;
                data.conversation_pending = false;
            }
            data.name_inbox = instance.instanceName;
            const result = this.chatwootService.create(instance, data);
            const urlServer = this.configService.get('SERVER').URL;
            const response = Object.assign(Object.assign({}, result), { webhook_url: `${urlServer}/chatwoot/webhook/${encodeURIComponent(instance.instanceName)}` });
            return response;
        });
    }
    findChatwoot(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findChatwoot from ' + instance.instanceName + ' instance');
            const result = yield this.chatwootService.find(instance);
            const urlServer = this.configService.get('SERVER').URL;
            if (Object.keys(result).length === 0) {
                return {
                    enabled: false,
                    url: '',
                    account_id: '',
                    token: '',
                    sign_msg: false,
                    name_inbox: '',
                    webhook_url: '',
                };
            }
            const response = Object.assign(Object.assign({}, result), { webhook_url: `${urlServer}/chatwoot/webhook/${encodeURIComponent(instance.instanceName)}` });
            return response;
        });
    }
    receiveWebhook(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested receiveWebhook from ' + instance.instanceName + ' instance');
            const chatwootService = new chatwoot_service_1.ChatwootService(whatsapp_module_1.waMonitor, this.configService);
            return chatwootService.receiveWebhook(instance, data);
        });
    }
}
exports.ChatwootController = ChatwootController;
