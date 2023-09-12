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
exports.WebsocketController = void 0;
const logger_config_1 = require("../../config/logger.config");
const logger = new logger_config_1.Logger('WebsocketController');
class WebsocketController {
    constructor(websocketService) {
        this.websocketService = websocketService;
    }
    createWebsocket(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested createWebsocket from ' + instance.instanceName + ' instance');
            if (!data.enabled) {
                logger.verbose('websocket disabled');
                data.events = [];
            }
            if (data.events.length === 0) {
                logger.verbose('websocket events empty');
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
            return this.websocketService.create(instance, data);
        });
    }
    findWebsocket(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findWebsocket from ' + instance.instanceName + ' instance');
            return this.websocketService.find(instance);
        });
    }
}
exports.WebsocketController = WebsocketController;
