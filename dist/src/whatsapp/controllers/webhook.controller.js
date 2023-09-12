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
exports.WebhookController = void 0;
const class_validator_1 = require("class-validator");
const logger_config_1 = require("../../config/logger.config");
const exceptions_1 = require("../../exceptions");
const logger = new logger_config_1.Logger('WebhookController');
class WebhookController {
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    createWebhook(instance, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested createWebhook from ' + instance.instanceName + ' instance');
            if (!(0, class_validator_1.isURL)(data.url, { require_tld: false })) {
                throw new exceptions_1.BadRequestException('Invalid "url" property');
            }
            data.enabled = (_a = data.enabled) !== null && _a !== void 0 ? _a : true;
            if (!data.enabled) {
                logger.verbose('webhook disabled');
                data.url = '';
                data.events = [];
            }
            else if (data.events.length === 0) {
                logger.verbose('webhook events empty');
                data.events = [
                    'APPLICATION_STARTUP',
                    'QRCODE_UPDATED',
                    'MESSAGES_SET',
                    'MESSAGES_UPSERT',
                    'MESSAGES_UPDATE',
                    'MESSAGES_DELETE',
                    'SEND_MESSAGE',
                    'CONTACTS_SET',
                    'CONTACTS_UPSERT',
                    'CONTACTS_UPDATE',
                    'PRESENCE_UPDATE',
                    'CHATS_SET',
                    'CHATS_UPSERT',
                    'CHATS_UPDATE',
                    'CHATS_DELETE',
                    'GROUPS_UPSERT',
                    'GROUP_UPDATE',
                    'GROUP_PARTICIPANTS_UPDATE',
                    'CONNECTION_UPDATE',
                    'CALL',
                    'NEW_JWT_TOKEN',
                ];
            }
            return this.webhookService.create(instance, data);
        });
    }
    findWebhook(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findWebhook from ' + instance.instanceName + ' instance');
            return this.webhookService.find(instance);
        });
    }
}
exports.WebhookController = WebhookController;
