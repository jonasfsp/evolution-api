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
exports.InstanceController = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const class_validator_1 = require("class-validator");
const logger_config_1 = require("../../config/logger.config");
const exceptions_1 = require("../../exceptions");
const whatsapp_service_1 = require("../services/whatsapp.service");
class InstanceController {
    constructor(waMonitor, configService, repository, eventEmitter, authService, webhookService, chatwootService, settingsService, websocketService, rabbitmqService, typebotService, cache) {
        this.waMonitor = waMonitor;
        this.configService = configService;
        this.repository = repository;
        this.eventEmitter = eventEmitter;
        this.authService = authService;
        this.webhookService = webhookService;
        this.chatwootService = chatwootService;
        this.settingsService = settingsService;
        this.websocketService = websocketService;
        this.rabbitmqService = rabbitmqService;
        this.typebotService = typebotService;
        this.cache = cache;
        this.logger = new logger_config_1.Logger(InstanceController.name);
    }
    createInstance({ instanceName, webhook, webhook_by_events, events, qrcode, number, token, chatwoot_account_id, chatwoot_token, chatwoot_url, chatwoot_sign_msg, chatwoot_reopen_conversation, chatwoot_conversation_pending, reject_call, msg_call, groups_ignore, always_online, read_messages, read_status, websocket_enabled, websocket_events, rabbitmq_enabled, rabbitmq_events, typebot_url, typebot, typebot_expire, typebot_keyword_finish, typebot_delay_message, typebot_unknown_message, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('requested createInstance from ' + instanceName + ' instance');
                this.logger.verbose('checking duplicate token');
                yield this.authService.checkDuplicateToken(token);
                this.logger.verbose('creating instance');
                const instance = new whatsapp_service_1.WAStartupService(this.configService, this.eventEmitter, this.repository, this.cache);
                instance.instanceName = instanceName;
                this.logger.verbose('instance: ' + instance.instanceName + ' created');
                this.waMonitor.waInstances[instance.instanceName] = instance;
                this.waMonitor.delInstanceTime(instance.instanceName);
                this.logger.verbose('generating hash');
                const hash = yield this.authService.generateHash({
                    instanceName: instance.instanceName,
                }, token);
                this.logger.verbose('hash: ' + hash + ' generated');
                let webhookEvents;
                if (webhook) {
                    if (!(0, class_validator_1.isURL)(webhook, { require_tld: false })) {
                        throw new exceptions_1.BadRequestException('Invalid "url" property in webhook');
                    }
                    this.logger.verbose('creating webhook');
                    try {
                        let newEvents = [];
                        if (events.length === 0) {
                            newEvents = [
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
                        else {
                            newEvents = events;
                        }
                        this.webhookService.create(instance, {
                            enabled: true,
                            url: webhook,
                            events: newEvents,
                            webhook_by_events,
                        });
                        webhookEvents = (yield this.webhookService.find(instance)).events;
                    }
                    catch (error) {
                        this.logger.log(error);
                    }
                }
                let websocketEvents;
                if (websocket_enabled) {
                    this.logger.verbose('creating websocket');
                    try {
                        let newEvents = [];
                        if (websocket_events.length === 0) {
                            newEvents = [
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
                        else {
                            newEvents = events;
                        }
                        this.websocketService.create(instance, {
                            enabled: true,
                            events: newEvents,
                        });
                        websocketEvents = (yield this.websocketService.find(instance)).events;
                    }
                    catch (error) {
                        this.logger.log(error);
                    }
                }
                let rabbitmqEvents;
                if (rabbitmq_enabled) {
                    this.logger.verbose('creating rabbitmq');
                    try {
                        let newEvents = [];
                        if (rabbitmq_events.length === 0) {
                            newEvents = [
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
                        else {
                            newEvents = events;
                        }
                        this.rabbitmqService.create(instance, {
                            enabled: true,
                            events: newEvents,
                        });
                        rabbitmqEvents = (yield this.rabbitmqService.find(instance)).events;
                    }
                    catch (error) {
                        this.logger.log(error);
                    }
                }
                if (typebot_url) {
                    try {
                        if (!(0, class_validator_1.isURL)(typebot_url, { require_tld: false })) {
                            throw new exceptions_1.BadRequestException('Invalid "url" property in typebot_url');
                        }
                        this.logger.verbose('creating typebot');
                        this.typebotService.create(instance, {
                            enabled: true,
                            url: typebot_url,
                            typebot: typebot,
                            expire: typebot_expire,
                            keyword_finish: typebot_keyword_finish,
                            delay_message: typebot_delay_message,
                            unknown_message: typebot_unknown_message,
                        });
                    }
                    catch (error) {
                        this.logger.log(error);
                    }
                }
                this.logger.verbose('creating settings');
                const settings = {
                    reject_call: reject_call || false,
                    msg_call: msg_call || '',
                    groups_ignore: groups_ignore || false,
                    always_online: always_online || false,
                    read_messages: read_messages || false,
                    read_status: read_status || false,
                };
                this.logger.verbose('settings: ' + JSON.stringify(settings));
                this.settingsService.create(instance, settings);
                if (!chatwoot_account_id || !chatwoot_token || !chatwoot_url) {
                    let getQrcode;
                    if (qrcode) {
                        this.logger.verbose('creating qrcode');
                        yield instance.connectToWhatsapp(number);
                        yield (0, baileys_1.delay)(5000);
                        getQrcode = instance.qrCode;
                    }
                    const result = {
                        instance: {
                            instanceName: instance.instanceName,
                            status: 'created',
                        },
                        hash,
                        webhook: {
                            webhook,
                            webhook_by_events,
                            events: webhookEvents,
                        },
                        websocket: {
                            enabled: websocket_enabled,
                            events: websocketEvents,
                        },
                        rabbitmq: {
                            enabled: rabbitmq_enabled,
                            events: rabbitmqEvents,
                        },
                        typebot: {
                            enabled: typebot_url ? true : false,
                            url: typebot_url,
                            typebot,
                            expire: typebot_expire,
                            keyword_finish: typebot_keyword_finish,
                            delay_message: typebot_delay_message,
                            unknown_message: typebot_unknown_message,
                        },
                        settings,
                        qrcode: getQrcode,
                    };
                    this.logger.verbose('instance created');
                    this.logger.verbose(result);
                    return result;
                }
                if (!chatwoot_account_id) {
                    throw new exceptions_1.BadRequestException('account_id is required');
                }
                if (!chatwoot_token) {
                    throw new exceptions_1.BadRequestException('token is required');
                }
                if (!chatwoot_url) {
                    throw new exceptions_1.BadRequestException('url is required');
                }
                if (!(0, class_validator_1.isURL)(chatwoot_url, { require_tld: false })) {
                    throw new exceptions_1.BadRequestException('Invalid "url" property in chatwoot');
                }
                if (chatwoot_sign_msg !== true && chatwoot_sign_msg !== false) {
                    throw new exceptions_1.BadRequestException('sign_msg is required');
                }
                if (chatwoot_reopen_conversation !== true && chatwoot_reopen_conversation !== false) {
                    throw new exceptions_1.BadRequestException('reopen_conversation is required');
                }
                if (chatwoot_conversation_pending !== true && chatwoot_conversation_pending !== false) {
                    throw new exceptions_1.BadRequestException('conversation_pending is required');
                }
                const urlServer = this.configService.get('SERVER').URL;
                try {
                    this.chatwootService.create(instance, {
                        enabled: true,
                        account_id: chatwoot_account_id,
                        token: chatwoot_token,
                        url: chatwoot_url,
                        sign_msg: chatwoot_sign_msg || false,
                        name_inbox: instance.instanceName.split('-cwId-')[0],
                        number,
                        reopen_conversation: chatwoot_reopen_conversation || false,
                        conversation_pending: chatwoot_conversation_pending || false,
                    });
                    this.chatwootService.initInstanceChatwoot(instance, instance.instanceName.split('-cwId-')[0], `${urlServer}/chatwoot/webhook/${encodeURIComponent(instance.instanceName)}`, qrcode, number);
                }
                catch (error) {
                    this.logger.log(error);
                }
                return {
                    instance: {
                        instanceName: instance.instanceName,
                        status: 'created',
                    },
                    hash,
                    webhook: {
                        webhook,
                        webhook_by_events,
                        events: webhookEvents,
                    },
                    websocket: {
                        enabled: websocket_enabled,
                        events: websocketEvents,
                    },
                    rabbitmq: {
                        enabled: rabbitmq_enabled,
                        events: rabbitmqEvents,
                    },
                    typebot: {
                        enabled: typebot_url ? true : false,
                        url: typebot_url,
                        typebot,
                        expire: typebot_expire,
                        keyword_finish: typebot_keyword_finish,
                        delay_message: typebot_delay_message,
                        unknown_message: typebot_unknown_message,
                    },
                    settings,
                    chatwoot: {
                        enabled: true,
                        account_id: chatwoot_account_id,
                        token: chatwoot_token,
                        url: chatwoot_url,
                        sign_msg: chatwoot_sign_msg || false,
                        reopen_conversation: chatwoot_reopen_conversation || false,
                        conversation_pending: chatwoot_conversation_pending || false,
                        number,
                        name_inbox: instance.instanceName,
                        webhook_url: `${urlServer}/chatwoot/webhook/${encodeURIComponent(instance.instanceName)}`,
                    },
                };
            }
            catch (error) {
                this.logger.error(error.message[0]);
                throw new exceptions_1.BadRequestException(error.message[0]);
            }
        });
    }
    connectToWhatsapp({ instanceName, number = null }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('requested connectToWhatsapp from ' + instanceName + ' instance');
                const instance = this.waMonitor.waInstances[instanceName];
                const state = (_a = instance === null || instance === void 0 ? void 0 : instance.connectionStatus) === null || _a === void 0 ? void 0 : _a.state;
                this.logger.verbose('state: ' + state);
                if (!state) {
                    throw new exceptions_1.BadRequestException('The "' + instanceName + '" instance does not exist');
                }
                if (state == 'open') {
                    return yield this.connectionState({ instanceName });
                }
                if (state == 'connecting') {
                    return instance.qrCode;
                }
                if (state == 'close') {
                    this.logger.verbose('connecting');
                    yield instance.connectToWhatsapp(number);
                    yield (0, baileys_1.delay)(5000);
                    return instance.qrCode;
                }
                return {
                    instance: {
                        instanceName: instanceName,
                        status: state,
                    },
                    qrcode: instance === null || instance === void 0 ? void 0 : instance.qrCode,
                };
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    restartInstance({ instanceName }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('requested restartInstance from ' + instanceName + ' instance');
                this.logger.verbose('logging out instance: ' + instanceName);
                (_c = (_b = (_a = this.waMonitor.waInstances[instanceName]) === null || _a === void 0 ? void 0 : _a.client) === null || _b === void 0 ? void 0 : _b.ws) === null || _c === void 0 ? void 0 : _c.close();
                return { status: 'SUCCESS', error: false, response: { message: 'Instance restarted' } };
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    connectionState({ instanceName }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('requested connectionState from ' + instanceName + ' instance');
            return {
                instance: {
                    instanceName: instanceName,
                    state: (_b = (_a = this.waMonitor.waInstances[instanceName]) === null || _a === void 0 ? void 0 : _a.connectionStatus) === null || _b === void 0 ? void 0 : _b.state,
                },
            };
        });
    }
    fetchInstances({ instanceName }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('requested fetchInstances from ' + instanceName + ' instance');
            if (instanceName) {
                this.logger.verbose('instanceName: ' + instanceName);
                return this.waMonitor.instanceInfo(instanceName);
            }
            return this.waMonitor.instanceInfo();
        });
    }
    logout({ instanceName }) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('requested logout from ' + instanceName + ' instance');
            const { instance } = yield this.connectionState({ instanceName });
            if (instance.state === 'close') {
                throw new exceptions_1.BadRequestException('The "' + instanceName + '" instance is not connected');
            }
            try {
                this.logger.verbose('logging out instance: ' + instanceName);
                yield ((_b = (_a = this.waMonitor.waInstances[instanceName]) === null || _a === void 0 ? void 0 : _a.client) === null || _b === void 0 ? void 0 : _b.logout('Log out instance: ' + instanceName));
                this.logger.verbose('close connection instance: ' + instanceName);
                (_e = (_d = (_c = this.waMonitor.waInstances[instanceName]) === null || _c === void 0 ? void 0 : _c.client) === null || _d === void 0 ? void 0 : _d.ws) === null || _e === void 0 ? void 0 : _e.close();
                return { status: 'SUCCESS', error: false, response: { message: 'Instance logged out' } };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException(error.toString());
            }
        });
    }
    deleteInstance({ instanceName }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('requested deleteInstance from ' + instanceName + ' instance');
            const { instance } = yield this.connectionState({ instanceName });
            if (instance.state === 'open') {
                throw new exceptions_1.BadRequestException('The "' + instanceName + '" instance needs to be disconnected');
            }
            try {
                if (instance.state === 'connecting') {
                    this.logger.verbose('logging out instance: ' + instanceName);
                    yield this.logout({ instanceName });
                    delete this.waMonitor.waInstances[instanceName];
                    return { status: 'SUCCESS', error: false, response: { message: 'Instance deleted' } };
                }
                else {
                    this.logger.verbose('deleting instance: ' + instanceName);
                    delete this.waMonitor.waInstances[instanceName];
                    this.eventEmitter.emit('remove.instance', instanceName, 'inner');
                    return { status: 'SUCCESS', error: false, response: { message: 'Instance deleted' } };
                }
            }
            catch (error) {
                throw new exceptions_1.BadRequestException(error.toString());
            }
        });
    }
    refreshToken(_, oldToken) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('requested refreshToken');
            return yield this.authService.refreshToken(oldToken);
        });
    }
}
exports.InstanceController = InstanceController;
