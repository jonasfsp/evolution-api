"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAStartupService = void 0;
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const class_validator_1 = require("class-validator");
const fs_1 = __importStar(require("fs"));
const long_1 = __importDefault(require("long"));
const node_cache_1 = __importDefault(require("node-cache"));
const node_mime_types_1 = require("node-mime-types");
const os_1 = require("os");
const path_1 = require("path");
const pino_1 = __importDefault(require("pino"));
const proxy_agent_1 = require("proxy-agent");
const qrcode_1 = __importDefault(require("qrcode"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const logger_config_1 = require("../../config/logger.config");
const path_config_1 = require("../../config/path.config");
const exceptions_1 = require("../../exceptions");
const amqp_server_1 = require("../../libs/amqp.server");
const db_connect_1 = require("../../libs/db.connect");
const socket_server_1 = require("../../libs/socket.server");
const use_multi_file_auth_state_db_1 = require("../../utils/use-multi-file-auth-state-db");
const use_multi_file_auth_state_redis_db_1 = require("../../utils/use-multi-file-auth-state-redis-db");
const chat_dto_1 = require("../dto/chat.dto");
const wa_types_1 = require("../types/wa.types");
const whatsapp_module_1 = require("../whatsapp.module");
const chatwoot_service_1 = require("./chatwoot.service");
const typebot_service_1 = require("./typebot.service");
class WAStartupService {
    constructor(configService, eventEmitter, repository, cache) {
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.repository = repository;
        this.cache = cache;
        this.logger = new logger_config_1.Logger(WAStartupService.name);
        this.instance = {};
        this.localWebhook = {};
        this.localChatwoot = {};
        this.localSettings = {};
        this.localWebsocket = {};
        this.localRabbitmq = {};
        this.localTypebot = {};
        this.localProxy = {};
        this.stateConnection = { state: 'close' };
        this.storePath = (0, path_1.join)(path_config_1.ROOT_DIR, 'store');
        this.msgRetryCounterCache = new node_cache_1.default();
        this.userDevicesCache = new node_cache_1.default();
        this.endSession = false;
        this.logBaileys = this.configService.get('LOG').BAILEYS;
        this.chatwootService = new chatwoot_service_1.ChatwootService(whatsapp_module_1.waMonitor, this.configService);
        this.typebotService = new typebot_service_1.TypebotService(whatsapp_module_1.waMonitor);
        this.chatHandle = {
            'chats.upsert': (chats, database) => { var _a, chats_1, chats_1_1; return __awaiter(this, void 0, void 0, function* () {
                var _b, e_1, _c, _d;
                this.logger.verbose('Event received: chats.upsert');
                this.logger.verbose('Finding chats in database');
                const chatsRepository = yield this.repository.chat.find({
                    where: { owner: this.instance.name },
                });
                this.logger.verbose('Verifying if chats exists in database to insert');
                const chatsRaw = [];
                try {
                    for (_a = true, chats_1 = __asyncValues(chats); chats_1_1 = yield chats_1.next(), _b = chats_1_1.done, !_b;) {
                        _d = chats_1_1.value;
                        _a = false;
                        try {
                            const chat = _d;
                            if (chatsRepository.find((cr) => cr.id === chat.id)) {
                                continue;
                            }
                            chatsRaw.push({ id: chat.id, owner: this.instance.wuid });
                        }
                        finally {
                            _a = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_a && !_b && (_c = chats_1.return)) yield _c.call(chats_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                this.logger.verbose('Sending data to webhook in event CHATS_UPSERT');
                yield this.sendDataWebhook(wa_types_1.Events.CHATS_UPSERT, chatsRaw);
                this.logger.verbose('Inserting chats in database');
                yield this.repository.chat.insert(chatsRaw, this.instance.name, database.SAVE_DATA.CHATS);
            }); },
            'chats.update': (chats) => __awaiter(this, void 0, void 0, function* () {
                this.logger.verbose('Event received: chats.update');
                const chatsRaw = chats.map((chat) => {
                    return { id: chat.id, owner: this.instance.wuid };
                });
                this.logger.verbose('Sending data to webhook in event CHATS_UPDATE');
                yield this.sendDataWebhook(wa_types_1.Events.CHATS_UPDATE, chatsRaw);
            }),
            'chats.delete': (chats) => __awaiter(this, void 0, void 0, function* () {
                this.logger.verbose('Event received: chats.delete');
                this.logger.verbose('Deleting chats in database');
                chats.forEach((chat) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.chat.delete({
                        where: { owner: this.instance.name, id: chat },
                    });
                }));
                this.logger.verbose('Sending data to webhook in event CHATS_DELETE');
                yield this.sendDataWebhook(wa_types_1.Events.CHATS_DELETE, [...chats]);
            }),
        };
        this.contactHandle = {
            'contacts.upsert': (contacts, database) => { var _a, contacts_1, contacts_1_1; return __awaiter(this, void 0, void 0, function* () {
                var _b, e_2, _c, _d;
                this.logger.verbose('Event received: contacts.upsert');
                this.logger.verbose('Finding contacts in database');
                const contactsRepository = yield this.repository.contact.find({
                    where: { owner: this.instance.name },
                });
                this.logger.verbose('Verifying if contacts exists in database to insert');
                const contactsRaw = [];
                try {
                    for (_a = true, contacts_1 = __asyncValues(contacts); contacts_1_1 = yield contacts_1.next(), _b = contacts_1_1.done, !_b;) {
                        _d = contacts_1_1.value;
                        _a = false;
                        try {
                            const contact = _d;
                            if (contactsRepository.find((cr) => cr.id === contact.id)) {
                                continue;
                            }
                            contactsRaw.push({
                                id: contact.id,
                                pushName: (contact === null || contact === void 0 ? void 0 : contact.name) || (contact === null || contact === void 0 ? void 0 : contact.verifiedName),
                                profilePictureUrl: (yield this.profilePicture(contact.id)).profilePictureUrl,
                                owner: this.instance.name,
                            });
                        }
                        finally {
                            _a = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_a && !_b && (_c = contacts_1.return)) yield _c.call(contacts_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                this.logger.verbose('Sending data to webhook in event CONTACTS_UPSERT');
                yield this.sendDataWebhook(wa_types_1.Events.CONTACTS_UPSERT, contactsRaw);
                this.logger.verbose('Inserting contacts in database');
                yield this.repository.contact.insert(contactsRaw, this.instance.name, database.SAVE_DATA.CONTACTS);
            }); },
            'contacts.update': (contacts, database) => { var _a, contacts_2, contacts_2_1; return __awaiter(this, void 0, void 0, function* () {
                var _b, e_3, _c, _d;
                var _e;
                this.logger.verbose('Event received: contacts.update');
                this.logger.verbose('Verifying if contacts exists in database to update');
                const contactsRaw = [];
                try {
                    for (_a = true, contacts_2 = __asyncValues(contacts); contacts_2_1 = yield contacts_2.next(), _b = contacts_2_1.done, !_b;) {
                        _d = contacts_2_1.value;
                        _a = false;
                        try {
                            const contact = _d;
                            contactsRaw.push({
                                id: contact.id,
                                pushName: (_e = contact === null || contact === void 0 ? void 0 : contact.name) !== null && _e !== void 0 ? _e : contact === null || contact === void 0 ? void 0 : contact.verifiedName,
                                profilePictureUrl: (yield this.profilePicture(contact.id)).profilePictureUrl,
                                owner: this.instance.name,
                            });
                        }
                        finally {
                            _a = true;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_a && !_b && (_c = contacts_2.return)) yield _c.call(contacts_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                this.logger.verbose('Sending data to webhook in event CONTACTS_UPDATE');
                yield this.sendDataWebhook(wa_types_1.Events.CONTACTS_UPDATE, contactsRaw);
                this.logger.verbose('Updating contacts in database');
                yield this.repository.contact.update(contactsRaw, this.instance.name, database.SAVE_DATA.CONTACTS);
            }); },
        };
        this.messageHandle = {
            'messaging-history.set': ({ messages, chats, isLatest, }, database) => __awaiter(this, void 0, void 0, function* () {
                var _a, e_4, _b, _c;
                var _d;
                this.logger.verbose('Event received: messaging-history.set');
                if (isLatest) {
                    this.logger.verbose('isLatest defined as true');
                    const chatsRaw = chats.map((chat) => {
                        return {
                            id: chat.id,
                            owner: this.instance.name,
                            lastMsgTimestamp: chat.lastMessageRecvTimestamp,
                        };
                    });
                    this.logger.verbose('Sending data to webhook in event CHATS_SET');
                    yield this.sendDataWebhook(wa_types_1.Events.CHATS_SET, chatsRaw);
                    this.logger.verbose('Inserting chats in database');
                    yield this.repository.chat.insert(chatsRaw, this.instance.name, database.SAVE_DATA.CHATS);
                }
                const messagesRaw = [];
                const messagesRepository = yield this.repository.message.find({
                    where: { owner: this.instance.name },
                });
                try {
                    for (var _e = true, _f = __asyncValues(Object.entries(messages)), _g; _g = yield _f.next(), _a = _g.done, !_a;) {
                        _c = _g.value;
                        _e = false;
                        try {
                            const [, m] = _c;
                            if (!m.message) {
                                continue;
                            }
                            if (messagesRepository.find((mr) => mr.owner === this.instance.name && mr.key.id === m.key.id)) {
                                continue;
                            }
                            if (long_1.default.isLong(m === null || m === void 0 ? void 0 : m.messageTimestamp)) {
                                m.messageTimestamp = (_d = m.messageTimestamp) === null || _d === void 0 ? void 0 : _d.toNumber();
                            }
                            messagesRaw.push({
                                key: m.key,
                                pushName: m.pushName,
                                participant: m.participant,
                                message: Object.assign({}, m.message),
                                messageType: (0, baileys_1.getContentType)(m.message),
                                messageTimestamp: m.messageTimestamp,
                                owner: this.instance.name,
                            });
                        }
                        finally {
                            _e = true;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                this.logger.verbose('Sending data to webhook in event MESSAGES_SET');
                this.sendDataWebhook(wa_types_1.Events.MESSAGES_SET, [...messagesRaw]);
                messages = undefined;
            }),
            'messages.upsert': ({ messages, type, }, database, settings) => __awaiter(this, void 0, void 0, function* () {
                var _h, _j, _k;
                this.logger.verbose('Event received: messages.upsert');
                const received = messages[0];
                if (type !== 'notify' || ((_h = received.message) === null || _h === void 0 ? void 0 : _h.protocolMessage) || ((_j = received.message) === null || _j === void 0 ? void 0 : _j.pollUpdateMessage)) {
                    this.logger.verbose('message rejected');
                    return;
                }
                if (long_1.default.isLong(received.messageTimestamp)) {
                    received.messageTimestamp = (_k = received.messageTimestamp) === null || _k === void 0 ? void 0 : _k.toNumber();
                }
                if ((settings === null || settings === void 0 ? void 0 : settings.groups_ignore) && received.key.remoteJid.includes('@g.us')) {
                    this.logger.verbose('group ignored');
                    return;
                }
                const messageRaw = {
                    key: received.key,
                    pushName: received.pushName,
                    message: Object.assign({}, received.message),
                    messageType: (0, baileys_1.getContentType)(received.message),
                    messageTimestamp: received.messageTimestamp,
                    owner: this.instance.name,
                    source: (0, baileys_1.getDevice)(received.key.id),
                };
                if (this.localSettings.read_messages && received.key.id !== 'status@broadcast') {
                    yield this.client.readMessages([received.key]);
                }
                if (this.localSettings.read_status && received.key.id === 'status@broadcast') {
                    yield this.client.readMessages([received.key]);
                }
                this.logger.log(messageRaw);
                this.logger.verbose('Sending data to webhook in event MESSAGES_UPSERT');
                yield this.sendDataWebhook(wa_types_1.Events.MESSAGES_UPSERT, messageRaw);
                if (this.localChatwoot.enabled) {
                    yield this.chatwootService.eventWhatsapp(wa_types_1.Events.MESSAGES_UPSERT, { instanceName: this.instance.name }, messageRaw);
                }
                if (this.localTypebot.enabled && messageRaw.key.remoteJid.includes('@s.whatsapp.net')) {
                    yield this.typebotService.sendTypebot({ instanceName: this.instance.name }, messageRaw.key.remoteJid, messageRaw);
                }
                this.logger.verbose('Inserting message in database');
                yield this.repository.message.insert([messageRaw], this.instance.name, database.SAVE_DATA.NEW_MESSAGE);
                this.logger.verbose('Verifying contact from message');
                const contact = yield this.repository.contact.find({
                    where: { owner: this.instance.name, id: received.key.remoteJid },
                });
                const contactRaw = {
                    id: received.key.remoteJid,
                    pushName: received.pushName,
                    profilePictureUrl: (yield this.profilePicture(received.key.remoteJid)).profilePictureUrl,
                    owner: this.instance.name,
                };
                if (contactRaw.id === 'status@broadcast') {
                    this.logger.verbose('Contact is status@broadcast');
                    return;
                }
                if (contact === null || contact === void 0 ? void 0 : contact.length) {
                    this.logger.verbose('Contact found in database');
                    const contactRaw = {
                        id: received.key.remoteJid,
                        pushName: contact[0].pushName,
                        profilePictureUrl: (yield this.profilePicture(received.key.remoteJid)).profilePictureUrl,
                        owner: this.instance.name,
                    };
                    this.logger.verbose('Sending data to webhook in event CONTACTS_UPDATE');
                    yield this.sendDataWebhook(wa_types_1.Events.CONTACTS_UPDATE, contactRaw);
                    if (this.localChatwoot.enabled) {
                        yield this.chatwootService.eventWhatsapp(wa_types_1.Events.CONTACTS_UPDATE, { instanceName: this.instance.name }, contactRaw);
                    }
                    this.logger.verbose('Updating contact in database');
                    yield this.repository.contact.update([contactRaw], this.instance.name, database.SAVE_DATA.CONTACTS);
                    return;
                }
                this.logger.verbose('Contact not found in database');
                this.logger.verbose('Sending data to webhook in event CONTACTS_UPSERT');
                yield this.sendDataWebhook(wa_types_1.Events.CONTACTS_UPSERT, contactRaw);
                this.logger.verbose('Inserting contact in database');
                yield this.repository.contact.insert([contactRaw], this.instance.name, database.SAVE_DATA.CONTACTS);
            }),
            'messages.update': (args, database, settings) => { var _a, args_1, args_1_1; return __awaiter(this, void 0, void 0, function* () {
                var _b, e_5, _c, _d;
                var _e;
                this.logger.verbose('Event received: messages.update');
                const status = {
                    0: 'ERROR',
                    1: 'PENDING',
                    2: 'SERVER_ACK',
                    3: 'DELIVERY_ACK',
                    4: 'READ',
                    5: 'PLAYED',
                };
                try {
                    for (_a = true, args_1 = __asyncValues(args); args_1_1 = yield args_1.next(), _b = args_1_1.done, !_b;) {
                        _d = args_1_1.value;
                        _a = false;
                        try {
                            const { key, update } = _d;
                            if ((settings === null || settings === void 0 ? void 0 : settings.groups_ignore) && key.remoteJid.includes('@g.us')) {
                                this.logger.verbose('group ignored');
                                return;
                            }
                            if (key.remoteJid !== 'status@broadcast' && !((_e = key === null || key === void 0 ? void 0 : key.remoteJid) === null || _e === void 0 ? void 0 : _e.match(/(:\d+)/))) {
                                this.logger.verbose('Message update is valid');
                                let pollUpdates;
                                if (update.pollUpdates) {
                                    this.logger.verbose('Poll update found');
                                    this.logger.verbose('Getting poll message');
                                    const pollCreation = yield this.getMessage(key);
                                    this.logger.verbose(pollCreation);
                                    if (pollCreation) {
                                        this.logger.verbose('Getting aggregate votes in poll message');
                                        pollUpdates = (0, baileys_1.getAggregateVotesInPollMessage)({
                                            message: pollCreation,
                                            pollUpdates: update.pollUpdates,
                                        });
                                    }
                                }
                                if (status[update.status] === 'READ' && !key.fromMe)
                                    return;
                                if (update.message === null && update.status === undefined) {
                                    this.logger.verbose('Message deleted');
                                    this.logger.verbose('Sending data to webhook in event MESSAGE_DELETE');
                                    yield this.sendDataWebhook(wa_types_1.Events.MESSAGES_DELETE, key);
                                    const message = Object.assign(Object.assign({}, key), { status: 'DELETED', datetime: Date.now(), owner: this.instance.name });
                                    this.logger.verbose(message);
                                    this.logger.verbose('Inserting message in database');
                                    yield this.repository.messageUpdate.insert([message], this.instance.name, database.SAVE_DATA.MESSAGE_UPDATE);
                                    return;
                                }
                                const message = Object.assign(Object.assign({}, key), { status: status[update.status], datetime: Date.now(), owner: this.instance.name, pollUpdates });
                                this.logger.verbose(message);
                                this.logger.verbose('Sending data to webhook in event MESSAGES_UPDATE');
                                yield this.sendDataWebhook(wa_types_1.Events.MESSAGES_UPDATE, message);
                                this.logger.verbose('Inserting message in database');
                                yield this.repository.messageUpdate.insert([message], this.instance.name, database.SAVE_DATA.MESSAGE_UPDATE);
                            }
                        }
                        finally {
                            _a = true;
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (!_a && !_b && (_c = args_1.return)) yield _c.call(args_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }); },
        };
        this.groupHandler = {
            'groups.upsert': (groupMetadata) => {
                this.logger.verbose('Event received: groups.upsert');
                this.logger.verbose('Sending data to webhook in event GROUPS_UPSERT');
                this.sendDataWebhook(wa_types_1.Events.GROUPS_UPSERT, groupMetadata);
            },
            'groups.update': (groupMetadataUpdate) => {
                this.logger.verbose('Event received: groups.update');
                this.logger.verbose('Sending data to webhook in event GROUPS_UPDATE');
                this.sendDataWebhook(wa_types_1.Events.GROUPS_UPDATE, groupMetadataUpdate);
            },
            'group-participants.update': (participantsUpdate) => {
                this.logger.verbose('Event received: group-participants.update');
                this.logger.verbose('Sending data to webhook in event GROUP_PARTICIPANTS_UPDATE');
                this.sendDataWebhook(wa_types_1.Events.GROUP_PARTICIPANTS_UPDATE, participantsUpdate);
            },
        };
        this.logger.verbose('WAStartupService initialized');
        this.cleanStore();
        this.instance.qrcode = { count: 0 };
    }
    set instanceName(name) {
        this.logger.verbose(`Initializing instance '${name}'`);
        if (!name) {
            this.logger.verbose('Instance name not found, generating random name with uuid');
            this.instance.name = (0, uuid_1.v4)();
            return;
        }
        this.instance.name = name;
        this.logger.verbose(`Instance '${this.instance.name}' initialized`);
        this.logger.verbose('Sending instance status to webhook');
        this.sendDataWebhook(wa_types_1.Events.STATUS_INSTANCE, {
            instance: this.instance.name,
            status: 'created',
        });
        if (this.localChatwoot.enabled) {
            this.chatwootService.eventWhatsapp(wa_types_1.Events.STATUS_INSTANCE, { instanceName: this.instance.name }, {
                instance: this.instance.name,
                status: 'created',
            });
        }
    }
    get instanceName() {
        this.logger.verbose('Getting instance name');
        return this.instance.name;
    }
    get wuid() {
        this.logger.verbose('Getting remoteJid of instance');
        return this.instance.wuid;
    }
    getProfileName() {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Getting profile name');
            let profileName = (_b = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = this.client.user) === null || _c === void 0 ? void 0 : _c.verifiedName;
            if (!profileName) {
                this.logger.verbose('Profile name not found, trying to get from database');
                if (this.configService.get('DATABASE').ENABLED) {
                    this.logger.verbose('Database enabled, trying to get from database');
                    const collection = db_connect_1.dbserver
                        .getClient()
                        .db(this.configService.get('DATABASE').CONNECTION.DB_PREFIX_NAME + '-instances')
                        .collection(this.instanceName);
                    const data = yield collection.findOne({ _id: 'creds' });
                    if (data) {
                        this.logger.verbose('Profile name found in database');
                        const creds = JSON.parse(JSON.stringify(data), baileys_1.BufferJSON.reviver);
                        profileName = ((_d = creds.me) === null || _d === void 0 ? void 0 : _d.name) || ((_e = creds.me) === null || _e === void 0 ? void 0 : _e.verifiedName);
                    }
                }
                else if ((0, fs_1.existsSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, this.instanceName, 'creds.json'))) {
                    this.logger.verbose('Profile name found in file');
                    const creds = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, this.instanceName, 'creds.json'), {
                        encoding: 'utf-8',
                    }));
                    profileName = ((_f = creds.me) === null || _f === void 0 ? void 0 : _f.name) || ((_g = creds.me) === null || _g === void 0 ? void 0 : _g.verifiedName);
                }
            }
            this.logger.verbose(`Profile name: ${profileName}`);
            return profileName;
        });
    }
    getProfileStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Getting profile status');
            const status = yield this.client.fetchStatus(this.instance.wuid);
            this.logger.verbose(`Profile status: ${status.status}`);
            return status.status;
        });
    }
    get profilePictureUrl() {
        this.logger.verbose('Getting profile picture url');
        return this.instance.profilePictureUrl;
    }
    get qrCode() {
        var _a, _b, _c;
        this.logger.verbose('Getting qrcode');
        return {
            pairingCode: (_a = this.instance.qrcode) === null || _a === void 0 ? void 0 : _a.pairingCode,
            code: (_b = this.instance.qrcode) === null || _b === void 0 ? void 0 : _b.code,
            base64: (_c = this.instance.qrcode) === null || _c === void 0 ? void 0 : _c.base64,
        };
    }
    loadWebhook() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Loading webhook');
            const data = yield this.repository.webhook.find(this.instanceName);
            this.localWebhook.url = data === null || data === void 0 ? void 0 : data.url;
            this.logger.verbose(`Webhook url: ${this.localWebhook.url}`);
            this.localWebhook.enabled = data === null || data === void 0 ? void 0 : data.enabled;
            this.logger.verbose(`Webhook enabled: ${this.localWebhook.enabled}`);
            this.localWebhook.events = data === null || data === void 0 ? void 0 : data.events;
            this.logger.verbose(`Webhook events: ${this.localWebhook.events}`);
            this.localWebhook.webhook_by_events = data === null || data === void 0 ? void 0 : data.webhook_by_events;
            this.logger.verbose(`Webhook by events: ${this.localWebhook.webhook_by_events}`);
            this.logger.verbose('Webhook loaded');
        });
    }
    setWebhook(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Setting webhook');
            yield this.repository.webhook.create(data, this.instanceName);
            this.logger.verbose(`Webhook url: ${data.url}`);
            this.logger.verbose(`Webhook events: ${data.events}`);
            Object.assign(this.localWebhook, data);
            this.logger.verbose('Webhook set');
        });
    }
    findWebhook() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Finding webhook');
            const data = yield this.repository.webhook.find(this.instanceName);
            if (!data) {
                this.logger.verbose('Webhook not found');
                throw new exceptions_1.NotFoundException('Webhook not found');
            }
            this.logger.verbose(`Webhook url: ${data.url}`);
            this.logger.verbose(`Webhook events: ${data.events}`);
            return data;
        });
    }
    loadChatwoot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Loading chatwoot');
            const data = yield this.repository.chatwoot.find(this.instanceName);
            this.localChatwoot.enabled = data === null || data === void 0 ? void 0 : data.enabled;
            this.logger.verbose(`Chatwoot enabled: ${this.localChatwoot.enabled}`);
            this.localChatwoot.account_id = data === null || data === void 0 ? void 0 : data.account_id;
            this.logger.verbose(`Chatwoot account id: ${this.localChatwoot.account_id}`);
            this.localChatwoot.token = data === null || data === void 0 ? void 0 : data.token;
            this.logger.verbose(`Chatwoot token: ${this.localChatwoot.token}`);
            this.localChatwoot.url = data === null || data === void 0 ? void 0 : data.url;
            this.logger.verbose(`Chatwoot url: ${this.localChatwoot.url}`);
            this.localChatwoot.name_inbox = data === null || data === void 0 ? void 0 : data.name_inbox;
            this.logger.verbose(`Chatwoot inbox name: ${this.localChatwoot.name_inbox}`);
            this.localChatwoot.sign_msg = data === null || data === void 0 ? void 0 : data.sign_msg;
            this.logger.verbose(`Chatwoot sign msg: ${this.localChatwoot.sign_msg}`);
            this.localChatwoot.number = data === null || data === void 0 ? void 0 : data.number;
            this.logger.verbose(`Chatwoot number: ${this.localChatwoot.number}`);
            this.localChatwoot.reopen_conversation = data === null || data === void 0 ? void 0 : data.reopen_conversation;
            this.logger.verbose(`Chatwoot reopen conversation: ${this.localChatwoot.reopen_conversation}`);
            this.localChatwoot.conversation_pending = data === null || data === void 0 ? void 0 : data.conversation_pending;
            this.logger.verbose(`Chatwoot conversation pending: ${this.localChatwoot.conversation_pending}`);
            this.logger.verbose('Chatwoot loaded');
        });
    }
    setChatwoot(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Setting chatwoot');
            yield this.repository.chatwoot.create(data, this.instanceName);
            this.logger.verbose(`Chatwoot account id: ${data.account_id}`);
            this.logger.verbose(`Chatwoot token: ${data.token}`);
            this.logger.verbose(`Chatwoot url: ${data.url}`);
            this.logger.verbose(`Chatwoot inbox name: ${data.name_inbox}`);
            this.logger.verbose(`Chatwoot sign msg: ${data.sign_msg}`);
            this.logger.verbose(`Chatwoot reopen conversation: ${data.reopen_conversation}`);
            this.logger.verbose(`Chatwoot conversation pending: ${data.conversation_pending}`);
            Object.assign(this.localChatwoot, data);
            this.logger.verbose('Chatwoot set');
        });
    }
    findChatwoot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Finding chatwoot');
            const data = yield this.repository.chatwoot.find(this.instanceName);
            if (!data) {
                this.logger.verbose('Chatwoot not found');
                return null;
            }
            this.logger.verbose(`Chatwoot account id: ${data.account_id}`);
            this.logger.verbose(`Chatwoot token: ${data.token}`);
            this.logger.verbose(`Chatwoot url: ${data.url}`);
            this.logger.verbose(`Chatwoot inbox name: ${data.name_inbox}`);
            this.logger.verbose(`Chatwoot sign msg: ${data.sign_msg}`);
            this.logger.verbose(`Chatwoot reopen conversation: ${data.reopen_conversation}`);
            this.logger.verbose(`Chatwoot conversation pending: ${data.conversation_pending}`);
            return data;
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Loading settings');
            const data = yield this.repository.settings.find(this.instanceName);
            this.localSettings.reject_call = data === null || data === void 0 ? void 0 : data.reject_call;
            this.logger.verbose(`Settings reject_call: ${this.localSettings.reject_call}`);
            this.localSettings.msg_call = data === null || data === void 0 ? void 0 : data.msg_call;
            this.logger.verbose(`Settings msg_call: ${this.localSettings.msg_call}`);
            this.localSettings.groups_ignore = data === null || data === void 0 ? void 0 : data.groups_ignore;
            this.logger.verbose(`Settings groups_ignore: ${this.localSettings.groups_ignore}`);
            this.localSettings.always_online = data === null || data === void 0 ? void 0 : data.always_online;
            this.logger.verbose(`Settings always_online: ${this.localSettings.always_online}`);
            this.localSettings.read_messages = data === null || data === void 0 ? void 0 : data.read_messages;
            this.logger.verbose(`Settings read_messages: ${this.localSettings.read_messages}`);
            this.localSettings.read_status = data === null || data === void 0 ? void 0 : data.read_status;
            this.logger.verbose(`Settings read_status: ${this.localSettings.read_status}`);
            this.logger.verbose('Settings loaded');
        });
    }
    setSettings(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Setting settings');
            yield this.repository.settings.create(data, this.instanceName);
            this.logger.verbose(`Settings reject_call: ${data.reject_call}`);
            this.logger.verbose(`Settings msg_call: ${data.msg_call}`);
            this.logger.verbose(`Settings groups_ignore: ${data.groups_ignore}`);
            this.logger.verbose(`Settings always_online: ${data.always_online}`);
            this.logger.verbose(`Settings read_messages: ${data.read_messages}`);
            this.logger.verbose(`Settings read_status: ${data.read_status}`);
            Object.assign(this.localSettings, data);
            this.logger.verbose('Settings set');
            (_b = (_a = this.client) === null || _a === void 0 ? void 0 : _a.ws) === null || _b === void 0 ? void 0 : _b.close();
        });
    }
    findSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Finding settings');
            const data = yield this.repository.settings.find(this.instanceName);
            if (!data) {
                this.logger.verbose('Settings not found');
                return null;
            }
            this.logger.verbose(`Settings url: ${data.reject_call}`);
            this.logger.verbose(`Settings msg_call: ${data.msg_call}`);
            this.logger.verbose(`Settings groups_ignore: ${data.groups_ignore}`);
            this.logger.verbose(`Settings always_online: ${data.always_online}`);
            this.logger.verbose(`Settings read_messages: ${data.read_messages}`);
            this.logger.verbose(`Settings read_status: ${data.read_status}`);
            return data;
        });
    }
    loadWebsocket() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Loading websocket');
            const data = yield this.repository.websocket.find(this.instanceName);
            this.localWebsocket.enabled = data === null || data === void 0 ? void 0 : data.enabled;
            this.logger.verbose(`Websocket enabled: ${this.localWebsocket.enabled}`);
            this.localWebsocket.events = data === null || data === void 0 ? void 0 : data.events;
            this.logger.verbose(`Websocket events: ${this.localWebsocket.events}`);
            this.logger.verbose('Websocket loaded');
        });
    }
    setWebsocket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Setting websocket');
            yield this.repository.websocket.create(data, this.instanceName);
            this.logger.verbose(`Websocket events: ${data.events}`);
            Object.assign(this.localWebsocket, data);
            this.logger.verbose('Websocket set');
        });
    }
    findWebsocket() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Finding websocket');
            const data = yield this.repository.websocket.find(this.instanceName);
            if (!data) {
                this.logger.verbose('Websocket not found');
                throw new exceptions_1.NotFoundException('Websocket not found');
            }
            this.logger.verbose(`Websocket events: ${data.events}`);
            return data;
        });
    }
    loadRabbitmq() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Loading rabbitmq');
            const data = yield this.repository.rabbitmq.find(this.instanceName);
            this.localRabbitmq.enabled = data === null || data === void 0 ? void 0 : data.enabled;
            this.logger.verbose(`Rabbitmq enabled: ${this.localRabbitmq.enabled}`);
            this.localRabbitmq.events = data === null || data === void 0 ? void 0 : data.events;
            this.logger.verbose(`Rabbitmq events: ${this.localRabbitmq.events}`);
            this.logger.verbose('Rabbitmq loaded');
        });
    }
    setRabbitmq(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Setting rabbitmq');
            yield this.repository.rabbitmq.create(data, this.instanceName);
            this.logger.verbose(`Rabbitmq events: ${data.events}`);
            Object.assign(this.localRabbitmq, data);
            this.logger.verbose('Rabbitmq set');
        });
    }
    findRabbitmq() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Finding rabbitmq');
            const data = yield this.repository.rabbitmq.find(this.instanceName);
            if (!data) {
                this.logger.verbose('Rabbitmq not found');
                throw new exceptions_1.NotFoundException('Rabbitmq not found');
            }
            this.logger.verbose(`Rabbitmq events: ${data.events}`);
            return data;
        });
    }
    loadTypebot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Loading typebot');
            const data = yield this.repository.typebot.find(this.instanceName);
            this.localTypebot.enabled = data === null || data === void 0 ? void 0 : data.enabled;
            this.logger.verbose(`Typebot enabled: ${this.localTypebot.enabled}`);
            this.localTypebot.url = data === null || data === void 0 ? void 0 : data.url;
            this.logger.verbose(`Typebot url: ${this.localTypebot.url}`);
            this.localTypebot.typebot = data === null || data === void 0 ? void 0 : data.typebot;
            this.logger.verbose(`Typebot typebot: ${this.localTypebot.typebot}`);
            this.localTypebot.expire = data === null || data === void 0 ? void 0 : data.expire;
            this.logger.verbose(`Typebot expire: ${this.localTypebot.expire}`);
            this.localTypebot.keyword_finish = data === null || data === void 0 ? void 0 : data.keyword_finish;
            this.logger.verbose(`Typebot keyword_finish: ${this.localTypebot.keyword_finish}`);
            this.localTypebot.delay_message = data === null || data === void 0 ? void 0 : data.delay_message;
            this.logger.verbose(`Typebot delay_message: ${this.localTypebot.delay_message}`);
            this.localTypebot.unknown_message = data === null || data === void 0 ? void 0 : data.unknown_message;
            this.logger.verbose(`Typebot unknown_message: ${this.localTypebot.unknown_message}`);
            this.localTypebot.sessions = data === null || data === void 0 ? void 0 : data.sessions;
            this.logger.verbose('Typebot loaded');
        });
    }
    setTypebot(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Setting typebot');
            yield this.repository.typebot.create(data, this.instanceName);
            this.logger.verbose(`Typebot typebot: ${data.typebot}`);
            this.logger.verbose(`Typebot expire: ${data.expire}`);
            this.logger.verbose(`Typebot keyword_finish: ${data.keyword_finish}`);
            this.logger.verbose(`Typebot delay_message: ${data.delay_message}`);
            this.logger.verbose(`Typebot unknown_message: ${data.unknown_message}`);
            Object.assign(this.localTypebot, data);
            this.logger.verbose('Typebot set');
        });
    }
    findTypebot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Finding typebot');
            const data = yield this.repository.typebot.find(this.instanceName);
            if (!data) {
                this.logger.verbose('Typebot not found');
                throw new exceptions_1.NotFoundException('Typebot not found');
            }
            return data;
        });
    }
    loadProxy() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Loading proxy');
            const data = yield this.repository.proxy.find(this.instanceName);
            this.localProxy.enabled = data === null || data === void 0 ? void 0 : data.enabled;
            this.logger.verbose(`Proxy enabled: ${this.localProxy.enabled}`);
            this.localProxy.proxy = data === null || data === void 0 ? void 0 : data.proxy;
            this.logger.verbose(`Proxy proxy: ${this.localProxy.proxy}`);
            this.logger.verbose('Proxy loaded');
        });
    }
    setProxy(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Setting proxy');
            yield this.repository.proxy.create(data, this.instanceName);
            this.logger.verbose(`Proxy proxy: ${data.proxy}`);
            Object.assign(this.localProxy, data);
            this.logger.verbose('Proxy set');
            (_b = (_a = this.client) === null || _a === void 0 ? void 0 : _a.ws) === null || _b === void 0 ? void 0 : _b.close();
        });
    }
    findProxy() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Finding proxy');
            const data = yield this.repository.proxy.find(this.instanceName);
            if (!data) {
                this.logger.verbose('Proxy not found');
                throw new exceptions_1.NotFoundException('Proxy not found');
            }
            return data;
        });
    }
    sendDataWebhook(event, data, local = true) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const webhookGlobal = this.configService.get('WEBHOOK');
            const webhookLocal = this.localWebhook.events;
            const websocketLocal = this.localWebsocket.events;
            const rabbitmqLocal = this.localRabbitmq.events;
            const serverUrl = this.configService.get('SERVER').URL;
            const we = event.replace(/[.-]/gm, '_').toUpperCase();
            const transformedWe = we.replace(/_/gm, '-').toLowerCase();
            const tzoffset = new Date().getTimezoneOffset() * 60000;
            const localISOTime = new Date(Date.now() - tzoffset).toISOString();
            const now = localISOTime;
            const expose = this.configService.get('AUTHENTICATION').EXPOSE_IN_FETCH_INSTANCES;
            const tokenStore = yield this.repository.auth.find(this.instanceName);
            const instanceApikey = (tokenStore === null || tokenStore === void 0 ? void 0 : tokenStore.apikey) || 'Apikey not found';
            if (this.localRabbitmq.enabled) {
                const amqp = (0, amqp_server_1.getAMQP)();
                if (amqp) {
                    if (Array.isArray(rabbitmqLocal) && rabbitmqLocal.includes(we)) {
                        const exchangeName = (_a = this.instanceName) !== null && _a !== void 0 ? _a : 'evolution_exchange';
                        amqp.assertExchange(exchangeName, 'topic', {
                            durable: true,
                            autoDelete: false,
                        });
                        const queueName = `${this.instanceName}.${event}`;
                        amqp.assertQueue(queueName, {
                            durable: true,
                            autoDelete: false,
                            arguments: {
                                'x-queue-type': 'quorum',
                            },
                        });
                        amqp.bindQueue(queueName, exchangeName, event);
                        const message = {
                            event,
                            instance: this.instance.name,
                            data,
                            server_url: serverUrl,
                            date_time: now,
                            sender: this.wuid,
                        };
                        if (expose && instanceApikey) {
                            message['apikey'] = instanceApikey;
                        }
                        amqp.publish(exchangeName, event, Buffer.from(JSON.stringify(message)));
                    }
                }
            }
            if (this.configService.get('WEBSOCKET').ENABLED && this.localWebsocket.enabled) {
                this.logger.verbose('Sending data to websocket on channel: ' + this.instance.name);
                if (Array.isArray(websocketLocal) && websocketLocal.includes(we)) {
                    this.logger.verbose('Sending data to websocket on event: ' + event);
                    const io = (0, socket_server_1.getIO)();
                    const message = {
                        event,
                        instance: this.instance.name,
                        data,
                        server_url: serverUrl,
                        date_time: now,
                        sender: this.wuid,
                    };
                    if (expose && instanceApikey) {
                        message['apikey'] = instanceApikey;
                    }
                    this.logger.verbose('Sending data to socket.io in channel: ' + this.instance.name);
                    io.of(`/${this.instance.name}`).emit(event, message);
                }
            }
            const globalApiKey = this.configService.get('AUTHENTICATION').API_KEY.KEY;
            if (local) {
                if (Array.isArray(webhookLocal) && webhookLocal.includes(we)) {
                    this.logger.verbose('Sending data to webhook local');
                    let baseURL;
                    if (this.localWebhook.webhook_by_events) {
                        baseURL = `${this.localWebhook.url}/${transformedWe}`;
                    }
                    else {
                        baseURL = this.localWebhook.url;
                    }
                    if (this.configService.get('LOG').LEVEL.includes('WEBHOOKS')) {
                        const logData = {
                            local: WAStartupService.name + '.sendDataWebhook-local',
                            url: baseURL,
                            event,
                            instance: this.instance.name,
                            data,
                            destination: this.localWebhook.url,
                            date_time: now,
                            sender: this.wuid,
                            server_url: serverUrl,
                            apikey: (expose && instanceApikey) || null,
                        };
                        if (expose && instanceApikey) {
                            logData['apikey'] = instanceApikey;
                        }
                        this.logger.log(logData);
                    }
                    try {
                        if (this.localWebhook.enabled && (0, class_validator_1.isURL)(this.localWebhook.url)) {
                            const httpService = axios_1.default.create({ baseURL });
                            const postData = {
                                event,
                                instance: this.instance.name,
                                data,
                                destination: this.localWebhook.url,
                                date_time: now,
                                sender: this.wuid,
                                server_url: serverUrl,
                            };
                            if (expose && instanceApikey) {
                                postData['apikey'] = instanceApikey;
                            }
                            yield httpService.post('', postData);
                        }
                    }
                    catch (error) {
                        this.logger.error({
                            local: WAStartupService.name + '.sendDataWebhook-local',
                            message: error === null || error === void 0 ? void 0 : error.message,
                            hostName: error === null || error === void 0 ? void 0 : error.hostname,
                            syscall: error === null || error === void 0 ? void 0 : error.syscall,
                            code: error === null || error === void 0 ? void 0 : error.code,
                            error: error === null || error === void 0 ? void 0 : error.errno,
                            stack: error === null || error === void 0 ? void 0 : error.stack,
                            name: error === null || error === void 0 ? void 0 : error.name,
                            url: baseURL,
                            server_url: serverUrl,
                        });
                    }
                }
            }
            if ((_b = webhookGlobal.GLOBAL) === null || _b === void 0 ? void 0 : _b.ENABLED) {
                if (webhookGlobal.EVENTS[we]) {
                    this.logger.verbose('Sending data to webhook global');
                    const globalWebhook = this.configService.get('WEBHOOK').GLOBAL;
                    let globalURL;
                    if (webhookGlobal.GLOBAL.WEBHOOK_BY_EVENTS) {
                        globalURL = `${globalWebhook.URL}/${transformedWe}`;
                    }
                    else {
                        globalURL = globalWebhook.URL;
                    }
                    const localUrl = this.localWebhook.url;
                    if (this.configService.get('LOG').LEVEL.includes('WEBHOOKS')) {
                        const logData = {
                            local: WAStartupService.name + '.sendDataWebhook-global',
                            url: globalURL,
                            event,
                            instance: this.instance.name,
                            data,
                            destination: localUrl,
                            date_time: now,
                            sender: this.wuid,
                            server_url: serverUrl,
                        };
                        if (expose && globalApiKey) {
                            logData['apikey'] = globalApiKey;
                        }
                        this.logger.log(logData);
                    }
                    try {
                        if (globalWebhook && (globalWebhook === null || globalWebhook === void 0 ? void 0 : globalWebhook.ENABLED) && (0, class_validator_1.isURL)(globalURL)) {
                            const httpService = axios_1.default.create({ baseURL: globalURL });
                            const postData = {
                                event,
                                instance: this.instance.name,
                                data,
                                destination: localUrl,
                                date_time: now,
                                sender: this.wuid,
                                server_url: serverUrl,
                            };
                            if (expose && globalApiKey) {
                                postData['apikey'] = globalApiKey;
                            }
                            yield httpService.post('', postData);
                        }
                    }
                    catch (error) {
                        this.logger.error({
                            local: WAStartupService.name + '.sendDataWebhook-global',
                            message: error === null || error === void 0 ? void 0 : error.message,
                            hostName: error === null || error === void 0 ? void 0 : error.hostname,
                            syscall: error === null || error === void 0 ? void 0 : error.syscall,
                            code: error === null || error === void 0 ? void 0 : error.code,
                            error: error === null || error === void 0 ? void 0 : error.errno,
                            stack: error === null || error === void 0 ? void 0 : error.stack,
                            name: error === null || error === void 0 ? void 0 : error.name,
                            url: globalURL,
                            server_url: serverUrl,
                        });
                    }
                }
            }
        });
    }
    connectionUpdate({ qr, connection, lastDisconnect }) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Connection update');
            if (qr) {
                this.logger.verbose('QR code found');
                if (this.instance.qrcode.count === this.configService.get('QRCODE').LIMIT) {
                    this.logger.verbose('QR code limit reached');
                    this.logger.verbose('Sending data to webhook in event QRCODE_UPDATED');
                    this.sendDataWebhook(wa_types_1.Events.QRCODE_UPDATED, {
                        message: 'QR code limit reached, please login again',
                        statusCode: baileys_1.DisconnectReason.badSession,
                    });
                    if (this.localChatwoot.enabled) {
                        this.chatwootService.eventWhatsapp(wa_types_1.Events.QRCODE_UPDATED, { instanceName: this.instance.name }, {
                            message: 'QR code limit reached, please login again',
                            statusCode: baileys_1.DisconnectReason.badSession,
                        });
                    }
                    this.logger.verbose('Sending data to webhook in event CONNECTION_UPDATE');
                    this.sendDataWebhook(wa_types_1.Events.CONNECTION_UPDATE, {
                        instance: this.instance.name,
                        state: 'refused',
                        statusReason: baileys_1.DisconnectReason.connectionClosed,
                    });
                    this.logger.verbose('endSession defined as true');
                    this.endSession = true;
                    this.logger.verbose('Emmiting event logout.instance');
                    return this.eventEmitter.emit('no.connection', this.instance.name);
                }
                this.logger.verbose('Incrementing QR code count');
                this.instance.qrcode.count++;
                const color = this.configService.get('QRCODE').COLOR;
                const optsQrcode = {
                    margin: 3,
                    scale: 4,
                    errorCorrectionLevel: 'H',
                    color: { light: '#ffffff', dark: color },
                };
                if (this.phoneNumber) {
                    yield (0, baileys_1.delay)(2000);
                    this.instance.qrcode.pairingCode = yield this.client.requestPairingCode(this.phoneNumber);
                }
                else {
                    this.instance.qrcode.pairingCode = null;
                }
                this.logger.verbose('Generating QR code');
                qrcode_1.default.toDataURL(qr, optsQrcode, (error, base64) => {
                    if (error) {
                        this.logger.error('Qrcode generate failed:' + error.toString());
                        return;
                    }
                    this.instance.qrcode.base64 = base64;
                    this.instance.qrcode.code = qr;
                    this.sendDataWebhook(wa_types_1.Events.QRCODE_UPDATED, {
                        qrcode: {
                            instance: this.instance.name,
                            pairingCode: this.instance.qrcode.pairingCode,
                            code: qr,
                            base64,
                        },
                    });
                    if (this.localChatwoot.enabled) {
                        this.chatwootService.eventWhatsapp(wa_types_1.Events.QRCODE_UPDATED, { instanceName: this.instance.name }, {
                            qrcode: {
                                instance: this.instance.name,
                                pairingCode: this.instance.qrcode.pairingCode,
                                code: qr,
                                base64,
                            },
                        });
                    }
                });
                this.logger.verbose('Generating QR code in terminal');
                qrcode_terminal_1.default.generate(qr, { small: true }, (qrcode) => this.logger.log(`\n{ instance: ${this.instance.name} pairingCode: ${this.instance.qrcode.pairingCode}, qrcodeCount: ${this.instance.qrcode.count} }\n` +
                    qrcode));
            }
            if (connection) {
                this.logger.verbose('Connection found');
                this.stateConnection = {
                    state: connection,
                    statusReason: (_c = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== null && _c !== void 0 ? _c : 200,
                };
                this.logger.verbose('Sending data to webhook in event CONNECTION_UPDATE');
                this.sendDataWebhook(wa_types_1.Events.CONNECTION_UPDATE, Object.assign({ instance: this.instance.name }, this.stateConnection));
            }
            if (connection === 'close') {
                this.logger.verbose('Connection closed');
                const shouldReconnect = ((_e = (_d = lastDisconnect.error) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    this.logger.verbose('Reconnecting to whatsapp');
                    yield this.connectToWhatsapp();
                }
                else {
                    this.logger.verbose('Do not reconnect to whatsapp');
                    this.logger.verbose('Sending data to webhook in event STATUS_INSTANCE');
                    this.sendDataWebhook(wa_types_1.Events.STATUS_INSTANCE, {
                        instance: this.instance.name,
                        status: 'closed',
                    });
                    if (this.localChatwoot.enabled) {
                        this.chatwootService.eventWhatsapp(wa_types_1.Events.STATUS_INSTANCE, { instanceName: this.instance.name }, {
                            instance: this.instance.name,
                            status: 'closed',
                        });
                    }
                    this.logger.verbose('Emittin event logout.instance');
                    this.eventEmitter.emit('logout.instance', this.instance.name, 'inner');
                    (_g = (_f = this.client) === null || _f === void 0 ? void 0 : _f.ws) === null || _g === void 0 ? void 0 : _g.close();
                    this.client.end(new Error('Close connection'));
                    this.logger.verbose('Connection closed');
                }
            }
            if (connection === 'open') {
                this.logger.verbose('Connection opened');
                this.instance.wuid = this.client.user.id.replace(/:\d+/, '');
                this.instance.profilePictureUrl = (yield this.profilePicture(this.instance.wuid)).profilePictureUrl;
                this.logger.info(`
        ┌──────────────────────────────┐
        │    CONNECTED TO WHATSAPP     │
        └──────────────────────────────┘`.replace(/^ +/gm, '  '));
                if (this.localChatwoot.enabled) {
                    this.chatwootService.eventWhatsapp(wa_types_1.Events.CONNECTION_UPDATE, { instanceName: this.instance.name }, {
                        instance: this.instance.name,
                        status: 'open',
                    });
                }
            }
        });
    }
    getMessage(key, full = false) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Getting message with key: ' + JSON.stringify(key));
            try {
                const webMessageInfo = (yield this.repository.message.find({
                    where: { owner: this.instance.name, key: { id: key.id } },
                }));
                if (full) {
                    this.logger.verbose('Returning full message');
                    return webMessageInfo[0];
                }
                if ((_a = webMessageInfo[0].message) === null || _a === void 0 ? void 0 : _a.pollCreationMessage) {
                    this.logger.verbose('Returning poll message');
                    const messageSecretBase64 = (_c = (_b = webMessageInfo[0].message) === null || _b === void 0 ? void 0 : _b.messageContextInfo) === null || _c === void 0 ? void 0 : _c.messageSecret;
                    if (typeof messageSecretBase64 === 'string') {
                        const messageSecret = Buffer.from(messageSecretBase64, 'base64');
                        const msg = {
                            messageContextInfo: {
                                messageSecret,
                            },
                            pollCreationMessage: (_d = webMessageInfo[0].message) === null || _d === void 0 ? void 0 : _d.pollCreationMessage,
                        };
                        return msg;
                    }
                }
                this.logger.verbose('Returning message');
                return webMessageInfo[0].message;
            }
            catch (error) {
                return { conversation: '' };
            }
        });
    }
    cleanStore() {
        var _a;
        this.logger.verbose('Cronjob to clean store initialized');
        const cleanStore = this.configService.get('CLEAN_STORE');
        const database = this.configService.get('DATABASE');
        if ((cleanStore === null || cleanStore === void 0 ? void 0 : cleanStore.CLEANING_INTERVAL) && !database.ENABLED) {
            this.logger.verbose('Cronjob to clean store enabled');
            setInterval(() => {
                try {
                    for (const [key, value] of Object.entries(cleanStore)) {
                        if (value === true) {
                            (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(this.storePath, key.toLowerCase().replace('_', '-'), this.instance.name)}/*.json`);
                            this.logger.verbose(`Cleaned ${(0, path_1.join)(this.storePath, key.toLowerCase().replace('_', '-'), this.instance.name)}/*.json`);
                        }
                    }
                }
                catch (error) {
                    this.logger.error(error);
                }
            }, ((_a = cleanStore === null || cleanStore === void 0 ? void 0 : cleanStore.CLEANING_INTERVAL) !== null && _a !== void 0 ? _a : 3600) * 1000);
        }
    }
    defineAuthState() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Defining auth state');
            const db = this.configService.get('DATABASE');
            const redis = this.configService.get('REDIS');
            if (redis === null || redis === void 0 ? void 0 : redis.ENABLED) {
                this.logger.verbose('Redis enabled');
                this.cache.reference = this.instance.name;
                return yield (0, use_multi_file_auth_state_redis_db_1.useMultiFileAuthStateRedisDb)(this.cache);
            }
            if (db.SAVE_DATA.INSTANCE && db.ENABLED) {
                this.logger.verbose('Database enabled');
                return yield (0, use_multi_file_auth_state_db_1.useMultiFileAuthStateDb)(this.instance.name);
            }
            this.logger.verbose('Store file enabled');
            return yield (0, baileys_1.useMultiFileAuthState)((0, path_1.join)(path_config_1.INSTANCE_DIR, this.instance.name));
        });
    }
    connectToWhatsapp(number) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Connecting to whatsapp');
            try {
                this.loadWebhook();
                this.loadChatwoot();
                this.loadSettings();
                this.loadWebsocket();
                this.loadRabbitmq();
                this.loadTypebot();
                this.loadProxy();
                this.instance.authState = yield this.defineAuthState();
                const { version } = yield (0, baileys_1.fetchLatestBaileysVersion)();
                this.logger.verbose('Baileys version: ' + version);
                const session = this.configService.get('CONFIG_SESSION_PHONE');
                const browser = [session.CLIENT, session.NAME, (0, os_1.release)()];
                this.logger.verbose('Browser: ' + JSON.stringify(browser));
                let options;
                if (this.localProxy.enabled) {
                    this.logger.verbose('Proxy enabled');
                    options = {
                        agent: new proxy_agent_1.ProxyAgent(this.localProxy.proxy),
                        fetchAgent: new proxy_agent_1.ProxyAgent(this.localProxy.proxy),
                    };
                }
                const socketConfig = Object.assign(Object.assign({}, options), { auth: {
                        creds: this.instance.authState.state.creds,
                        keys: (0, baileys_1.makeCacheableSignalKeyStore)(this.instance.authState.state.keys, (0, pino_1.default)({ level: 'error' })),
                    }, logger: (0, pino_1.default)({ level: this.logBaileys }), printQRInTerminal: false, browser,
                    version, markOnlineOnConnect: this.localSettings.always_online, connectTimeoutMs: 60000, qrTimeout: 40000, defaultQueryTimeoutMs: undefined, emitOwnEvents: false, msgRetryCounterCache: this.msgRetryCounterCache, getMessage: (key) => __awaiter(this, void 0, void 0, function* () { return (yield this.getMessage(key)); }), generateHighQualityLinkPreview: true, syncFullHistory: true, userDevicesCache: this.userDevicesCache, transactionOpts: { maxCommitRetries: 1, delayBetweenTriesMs: 10 }, patchMessageBeforeSending: (message) => {
                        const requiresPatch = !!(message.buttonsMessage || message.listMessage || message.templateMessage);
                        if (requiresPatch) {
                            message = {
                                viewOnceMessageV2: {
                                    message: Object.assign({ messageContextInfo: {
                                            deviceListMetadataVersion: 2,
                                            deviceListMetadata: {},
                                        } }, message),
                                },
                            };
                        }
                        return message;
                    } });
                this.endSession = false;
                this.logger.verbose('Creating socket');
                this.client = (0, baileys_1.default)(socketConfig);
                this.logger.verbose('Socket created');
                this.eventHandler();
                this.logger.verbose('Socket event handler initialized');
                this.phoneNumber = number;
                return this.client;
            }
            catch (error) {
                this.logger.error(error);
                throw new exceptions_1.InternalServerErrorException(error === null || error === void 0 ? void 0 : error.toString());
            }
        });
    }
    eventHandler() {
        this.logger.verbose('Initializing event handler');
        this.client.ev.process((events) => __awaiter(this, void 0, void 0, function* () {
            if (!this.endSession) {
                const database = this.configService.get('DATABASE');
                const settings = yield this.findSettings();
                if (events.call) {
                    this.logger.verbose('Listening event: call');
                    const call = events.call[0];
                    if ((settings === null || settings === void 0 ? void 0 : settings.reject_call) && call.status == 'offer') {
                        this.logger.verbose('Rejecting call');
                        this.client.rejectCall(call.id, call.from);
                    }
                    if ((settings === null || settings === void 0 ? void 0 : settings.msg_call.trim().length) > 0 && call.status == 'offer') {
                        this.logger.verbose('Sending message in call');
                        const msg = yield this.client.sendMessage(call.from, {
                            text: settings.msg_call,
                        });
                        this.logger.verbose('Sending data to event messages.upsert');
                        this.client.ev.emit('messages.upsert', {
                            messages: [msg],
                            type: 'notify',
                        });
                    }
                    this.logger.verbose('Sending data to webhook in event CALL');
                    this.sendDataWebhook(wa_types_1.Events.CALL, call);
                }
                if (events['connection.update']) {
                    this.logger.verbose('Listening event: connection.update');
                    this.connectionUpdate(events['connection.update']);
                }
                if (events['creds.update']) {
                    this.logger.verbose('Listening event: creds.update');
                    this.instance.authState.saveCreds();
                }
                if (events['messaging-history.set']) {
                    this.logger.verbose('Listening event: messaging-history.set');
                    const payload = events['messaging-history.set'];
                    this.messageHandle['messaging-history.set'](payload, database);
                }
                if (events['messages.upsert']) {
                    this.logger.verbose('Listening event: messages.upsert');
                    const payload = events['messages.upsert'];
                    this.messageHandle['messages.upsert'](payload, database, settings);
                }
                if (events['messages.update']) {
                    this.logger.verbose('Listening event: messages.update');
                    const payload = events['messages.update'];
                    this.messageHandle['messages.update'](payload, database, settings);
                }
                if (events['presence.update']) {
                    this.logger.verbose('Listening event: presence.update');
                    const payload = events['presence.update'];
                    if (settings.groups_ignore && payload.id.includes('@g.us')) {
                        this.logger.verbose('group ignored');
                        return;
                    }
                    this.sendDataWebhook(wa_types_1.Events.PRESENCE_UPDATE, payload);
                }
                if (!(settings === null || settings === void 0 ? void 0 : settings.groups_ignore)) {
                    if (events['groups.upsert']) {
                        this.logger.verbose('Listening event: groups.upsert');
                        const payload = events['groups.upsert'];
                        this.groupHandler['groups.upsert'](payload);
                    }
                    if (events['groups.update']) {
                        this.logger.verbose('Listening event: groups.update');
                        const payload = events['groups.update'];
                        this.groupHandler['groups.update'](payload);
                    }
                    if (events['group-participants.update']) {
                        this.logger.verbose('Listening event: group-participants.update');
                        const payload = events['group-participants.update'];
                        this.groupHandler['group-participants.update'](payload);
                    }
                }
                if (events['chats.upsert']) {
                    this.logger.verbose('Listening event: chats.upsert');
                    const payload = events['chats.upsert'];
                    this.chatHandle['chats.upsert'](payload, database);
                }
                if (events['chats.update']) {
                    this.logger.verbose('Listening event: chats.update');
                    const payload = events['chats.update'];
                    this.chatHandle['chats.update'](payload);
                }
                if (events['chats.delete']) {
                    this.logger.verbose('Listening event: chats.delete');
                    const payload = events['chats.delete'];
                    this.chatHandle['chats.delete'](payload);
                }
                if (events['contacts.upsert']) {
                    this.logger.verbose('Listening event: contacts.upsert');
                    const payload = events['contacts.upsert'];
                    this.contactHandle['contacts.upsert'](payload, database);
                }
                if (events['contacts.update']) {
                    this.logger.verbose('Listening event: contacts.update');
                    const payload = events['contacts.update'];
                    this.contactHandle['contacts.update'](payload, database);
                }
            }
        }));
    }
    formatMXOrARNumber(jid) {
        const countryCode = jid.substring(0, 2);
        if (Number(countryCode) === 52 || Number(countryCode) === 54) {
            if (jid.length === 13) {
                const number = countryCode + jid.substring(3);
                return number;
            }
            return jid;
        }
        return jid;
    }
    formatBRNumber(jid) {
        const regexp = new RegExp(/^(\d{2})(\d{2})\d{1}(\d{8})$/);
        if (regexp.test(jid)) {
            const match = regexp.exec(jid);
            if (match && match[1] === '55') {
                const joker = Number.parseInt(match[3][0]);
                const ddd = Number.parseInt(match[2]);
                if (joker < 7 || ddd < 31) {
                    return match[0];
                }
                return match[1] + match[2] + match[3];
            }
            return jid;
        }
        else {
            return jid;
        }
    }
    createJid(number) {
        this.logger.verbose('Creating jid with number: ' + number);
        if (number.includes('@g.us') || number.includes('@s.whatsapp.net')) {
            this.logger.verbose('Number already contains @g.us or @s.whatsapp.net');
            return number;
        }
        if (number.includes('@broadcast')) {
            this.logger.verbose('Number already contains @broadcast');
            return number;
        }
        number = number === null || number === void 0 ? void 0 : number.replace(/\s/g, '').replace(/\+/g, '').replace(/\(/g, '').replace(/\)/g, '').split(':')[0].split('@')[0];
        if (number.includes('-') && number.length >= 24) {
            this.logger.verbose('Jid created is group: ' + `${number}@g.us`);
            number = number.replace(/[^\d-]/g, '');
            return `${number}@g.us`;
        }
        number = number.replace(/\D/g, '');
        if (number.length >= 18) {
            this.logger.verbose('Jid created is group: ' + `${number}@g.us`);
            number = number.replace(/[^\d-]/g, '');
            return `${number}@g.us`;
        }
        this.logger.verbose('Jid created is whatsapp: ' + `${number}@s.whatsapp.net`);
        return `${number}@s.whatsapp.net`;
    }
    profilePicture(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const jid = this.createJid(number);
            this.logger.verbose('Getting profile picture with jid: ' + jid);
            try {
                this.logger.verbose('Getting profile picture url');
                return {
                    wuid: jid,
                    profilePictureUrl: yield this.client.profilePictureUrl(jid, 'image'),
                };
            }
            catch (error) {
                this.logger.verbose('Profile picture not found');
                return {
                    wuid: jid,
                    profilePictureUrl: null,
                };
            }
        });
    }
    getStatus(number) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const jid = this.createJid(number);
            this.logger.verbose('Getting profile status with jid:' + jid);
            try {
                this.logger.verbose('Getting status');
                return {
                    wuid: jid,
                    status: (_a = (yield this.client.fetchStatus(jid))) === null || _a === void 0 ? void 0 : _a.status,
                };
            }
            catch (error) {
                this.logger.verbose('Status not found');
                return {
                    wuid: jid,
                    status: null,
                };
            }
        });
    }
    fetchProfile(instanceName, number) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            const jid = number ? this.createJid(number) : (_b = (_a = this.client) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
            this.logger.verbose('Getting profile with jid: ' + jid);
            try {
                this.logger.verbose('Getting profile info');
                const business = yield this.fetchBusinessProfile(jid);
                if (number) {
                    const info = (_c = (yield this.whatsappNumber({ numbers: [jid] }))) === null || _c === void 0 ? void 0 : _c.shift();
                    const picture = yield this.profilePicture(jid);
                    const status = yield this.getStatus(jid);
                    return {
                        wuid: jid,
                        name: info === null || info === void 0 ? void 0 : info.name,
                        numberExists: info === null || info === void 0 ? void 0 : info.exists,
                        picture: picture === null || picture === void 0 ? void 0 : picture.profilePictureUrl,
                        status: status === null || status === void 0 ? void 0 : status.status,
                        isBusiness: business.isBusiness,
                        email: business === null || business === void 0 ? void 0 : business.email,
                        description: business === null || business === void 0 ? void 0 : business.description,
                        website: (_d = business === null || business === void 0 ? void 0 : business.website) === null || _d === void 0 ? void 0 : _d.shift(),
                    };
                }
                else {
                    const info = yield whatsapp_module_1.waMonitor.instanceInfo(instanceName);
                    return {
                        wuid: jid,
                        name: (_e = info === null || info === void 0 ? void 0 : info.instance) === null || _e === void 0 ? void 0 : _e.profileName,
                        numberExists: true,
                        picture: (_f = info === null || info === void 0 ? void 0 : info.instance) === null || _f === void 0 ? void 0 : _f.profilePictureUrl,
                        status: (_g = info === null || info === void 0 ? void 0 : info.instance) === null || _g === void 0 ? void 0 : _g.profileStatus,
                        isBusiness: business.isBusiness,
                        email: business === null || business === void 0 ? void 0 : business.email,
                        description: business === null || business === void 0 ? void 0 : business.description,
                        website: (_h = business === null || business === void 0 ? void 0 : business.website) === null || _h === void 0 ? void 0 : _h.shift(),
                    };
                }
            }
            catch (error) {
                this.logger.verbose('Profile not found');
                return {
                    wuid: jid,
                    name: null,
                    picture: null,
                    status: null,
                    os: null,
                    isBusiness: false,
                };
            }
        });
    }
    sendMessageWithTyping(number, message, options) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending message with typing');
            const numberWA = yield this.whatsappNumber({ numbers: [number] });
            const isWA = numberWA[0];
            if (!isWA.exists && !(0, baileys_1.isJidGroup)(isWA.jid) && !isWA.jid.includes('@broadcast')) {
                throw new exceptions_1.BadRequestException(isWA);
            }
            const sender = isWA.jid;
            try {
                if (options === null || options === void 0 ? void 0 : options.delay) {
                    this.logger.verbose('Delaying message');
                    yield this.client.presenceSubscribe(sender);
                    this.logger.verbose('Subscribing to presence');
                    yield this.client.sendPresenceUpdate((_a = options === null || options === void 0 ? void 0 : options.presence) !== null && _a !== void 0 ? _a : 'composing', sender);
                    this.logger.verbose((_b = 'Sending presence update: ' + (options === null || options === void 0 ? void 0 : options.presence)) !== null && _b !== void 0 ? _b : 'composing');
                    yield (0, baileys_1.delay)(options.delay);
                    this.logger.verbose('Set delay: ' + options.delay);
                    yield this.client.sendPresenceUpdate('paused', sender);
                    this.logger.verbose('Sending presence update: paused');
                }
                const linkPreview = (options === null || options === void 0 ? void 0 : options.linkPreview) != false ? undefined : false;
                let quoted;
                if (options === null || options === void 0 ? void 0 : options.quoted) {
                    const m = options === null || options === void 0 ? void 0 : options.quoted;
                    const msg = (m === null || m === void 0 ? void 0 : m.message) ? m : (yield this.getMessage(m.key, true));
                    if (!msg) {
                        throw 'Message not found';
                    }
                    quoted = msg;
                    this.logger.verbose('Quoted message');
                }
                let mentions;
                if ((0, baileys_1.isJidGroup)(sender)) {
                    try {
                        const groupMetadata = yield this.client.groupMetadata(sender);
                        if (!groupMetadata) {
                            throw new exceptions_1.NotFoundException('Group not found');
                        }
                        if (options === null || options === void 0 ? void 0 : options.mentions) {
                            this.logger.verbose('Mentions defined');
                            if ((_c = options.mentions) === null || _c === void 0 ? void 0 : _c.everyOne) {
                                this.logger.verbose('Mentions everyone');
                                this.logger.verbose('Getting group metadata');
                                mentions = groupMetadata.participants.map((participant) => participant.id);
                                this.logger.verbose('Getting group metadata for mentions');
                            }
                            else if ((_e = (_d = options.mentions) === null || _d === void 0 ? void 0 : _d.mentioned) === null || _e === void 0 ? void 0 : _e.length) {
                                this.logger.verbose('Mentions manually defined');
                                mentions = options.mentions.mentioned.map((mention) => {
                                    const jid = this.createJid(mention);
                                    if ((0, baileys_1.isJidGroup)(jid)) {
                                        return null;
                                    }
                                    return jid;
                                });
                            }
                        }
                    }
                    catch (error) {
                        throw new exceptions_1.NotFoundException('Group not found');
                    }
                }
                const messageSent = yield (() => __awaiter(this, void 0, void 0, function* () {
                    const option = {
                        quoted,
                    };
                    if (!message['audio'] &&
                        !message['poll'] &&
                        !message['sticker'] &&
                        !message['conversation'] &&
                        sender !== 'status@broadcast') {
                        if (!message['audio']) {
                            this.logger.verbose('Sending message');
                            return yield this.client.sendMessage(sender, {
                                forward: {
                                    key: { remoteJid: this.instance.wuid, fromMe: true },
                                    message,
                                },
                                mentions,
                            }, option);
                        }
                    }
                    if (message['conversation']) {
                        this.logger.verbose('Sending message');
                        return yield this.client.sendMessage(sender, {
                            text: message['conversation'],
                            mentions,
                            linkPreview: linkPreview,
                        }, option);
                    }
                    if (sender === 'status@broadcast') {
                        this.logger.verbose('Sending message');
                        return yield this.client.sendMessage(sender, message['status'].content, {
                            backgroundColor: message['status'].option.backgroundColor,
                            font: message['status'].option.font,
                            statusJidList: message['status'].option.statusJidList,
                        });
                    }
                    this.logger.verbose('Sending message');
                    return yield this.client.sendMessage(sender, message, option);
                }))();
                const messageRaw = {
                    key: messageSent.key,
                    pushName: messageSent.pushName,
                    message: Object.assign({}, messageSent.message),
                    messageType: (0, baileys_1.getContentType)(messageSent.message),
                    messageTimestamp: messageSent.messageTimestamp,
                    owner: this.instance.name,
                    source: (0, baileys_1.getDevice)(messageSent.key.id),
                };
                this.logger.log(messageRaw);
                this.logger.verbose('Sending data to webhook in event SEND_MESSAGE');
                yield this.sendDataWebhook(wa_types_1.Events.SEND_MESSAGE, messageRaw);
                if (this.localChatwoot.enabled) {
                    this.chatwootService.eventWhatsapp(wa_types_1.Events.SEND_MESSAGE, { instanceName: this.instance.name }, messageRaw);
                }
                this.logger.verbose('Inserting message in database');
                yield this.repository.message.insert([messageRaw], this.instance.name, this.configService.get('DATABASE').SAVE_DATA.NEW_MESSAGE);
                return messageSent;
            }
            catch (error) {
                this.logger.error(error);
                throw new exceptions_1.BadRequestException(error.toString());
            }
        });
    }
    get connectionStatus() {
        this.logger.verbose('Getting connection status');
        return this.stateConnection;
    }
    textMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending text message');
            return yield this.sendMessageWithTyping(data.number, {
                conversation: data.textMessage.text,
            }, data === null || data === void 0 ? void 0 : data.options);
        });
    }
    pollMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending poll message');
            return yield this.sendMessageWithTyping(data.number, {
                poll: {
                    name: data.pollMessage.name,
                    selectableCount: data.pollMessage.selectableCount,
                    values: data.pollMessage.values,
                },
            }, data === null || data === void 0 ? void 0 : data.options);
        });
    }
    formatStatusMessage(status) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Formatting status message');
            if (!status.type) {
                throw new exceptions_1.BadRequestException('Type is required');
            }
            if (!status.content) {
                throw new exceptions_1.BadRequestException('Content is required');
            }
            if (status.allContacts) {
                this.logger.verbose('All contacts defined as true');
                this.logger.verbose('Getting contacts from database');
                const contacts = yield this.repository.contact.find({
                    where: { owner: this.instance.name },
                });
                if (!contacts.length) {
                    throw new exceptions_1.BadRequestException('Contacts not found');
                }
                this.logger.verbose('Getting contacts with push name');
                status.statusJidList = contacts.filter((contact) => contact.pushName).map((contact) => contact.id);
                this.logger.verbose(status.statusJidList);
            }
            if (!((_a = status.statusJidList) === null || _a === void 0 ? void 0 : _a.length) && !status.allContacts) {
                throw new exceptions_1.BadRequestException('StatusJidList is required');
            }
            if (status.type === 'text') {
                this.logger.verbose('Type defined as text');
                if (!status.backgroundColor) {
                    throw new exceptions_1.BadRequestException('Background color is required');
                }
                if (!status.font) {
                    throw new exceptions_1.BadRequestException('Font is required');
                }
                return {
                    content: {
                        text: status.content,
                    },
                    option: {
                        backgroundColor: status.backgroundColor,
                        font: status.font,
                        statusJidList: status.statusJidList,
                    },
                };
            }
            if (status.type === 'image') {
                this.logger.verbose('Type defined as image');
                return {
                    content: {
                        image: {
                            url: status.content,
                        },
                        caption: status.caption,
                    },
                    option: {
                        statusJidList: status.statusJidList,
                    },
                };
            }
            if (status.type === 'video') {
                this.logger.verbose('Type defined as video');
                return {
                    content: {
                        video: {
                            url: status.content,
                        },
                        caption: status.caption,
                    },
                    option: {
                        statusJidList: status.statusJidList,
                    },
                };
            }
            if (status.type === 'audio') {
                this.logger.verbose('Type defined as audio');
                this.logger.verbose('Processing audio');
                const convert = yield this.processAudio(status.content, 'status@broadcast');
                if (typeof convert === 'string') {
                    this.logger.verbose('Audio processed');
                    const audio = fs_1.default.readFileSync(convert).toString('base64');
                    const result = {
                        content: {
                            audio: Buffer.from(audio, 'base64'),
                            ptt: true,
                            mimetype: 'audio/mp4',
                        },
                        option: {
                            statusJidList: status.statusJidList,
                        },
                    };
                    fs_1.default.unlinkSync(convert);
                    return result;
                }
                else {
                    throw new exceptions_1.InternalServerErrorException(convert);
                }
            }
            throw new exceptions_1.BadRequestException('Type not found');
        });
    }
    statusMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending status message');
            const status = yield this.formatStatusMessage(data.statusMessage);
            return yield this.sendMessageWithTyping('status@broadcast', {
                status,
            });
        });
    }
    prepareMediaMessage(mediaMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('Preparing media message');
                const prepareMedia = yield (0, baileys_1.prepareWAMessageMedia)({
                    [mediaMessage.mediatype]: (0, class_validator_1.isURL)(mediaMessage.media)
                        ? { url: mediaMessage.media }
                        : Buffer.from(mediaMessage.media, 'base64'),
                }, { upload: this.client.waUploadToServer });
                const mediaType = mediaMessage.mediatype + 'Message';
                this.logger.verbose('Media type: ' + mediaType);
                if (mediaMessage.mediatype === 'document' && !mediaMessage.fileName) {
                    this.logger.verbose('If media type is document and file name is not defined then');
                    const regex = new RegExp(/.*\/(.+?)\./);
                    const arrayMatch = regex.exec(mediaMessage.media);
                    mediaMessage.fileName = arrayMatch[1];
                    this.logger.verbose('File name: ' + mediaMessage.fileName);
                }
                if (mediaMessage.mediatype === 'image' && !mediaMessage.fileName) {
                    mediaMessage.fileName = 'image.png';
                }
                if (mediaMessage.mediatype === 'video' && !mediaMessage.fileName) {
                    mediaMessage.fileName = 'video.mp4';
                }
                let mimetype;
                if ((0, class_validator_1.isURL)(mediaMessage.media)) {
                    mimetype = (0, node_mime_types_1.getMIMEType)(mediaMessage.media);
                }
                else {
                    mimetype = (0, node_mime_types_1.getMIMEType)(mediaMessage.fileName);
                }
                this.logger.verbose('Mimetype: ' + mimetype);
                prepareMedia[mediaType].caption = mediaMessage === null || mediaMessage === void 0 ? void 0 : mediaMessage.caption;
                prepareMedia[mediaType].mimetype = mimetype;
                prepareMedia[mediaType].fileName = mediaMessage.fileName;
                if (mediaMessage.mediatype === 'video') {
                    this.logger.verbose('Is media type video then set gif playback as false');
                    prepareMedia[mediaType].jpegThumbnail = Uint8Array.from((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'public', 'images', 'video-cover.png')));
                    prepareMedia[mediaType].gifPlayback = false;
                }
                this.logger.verbose('Generating wa message from content');
                return (0, baileys_1.generateWAMessageFromContent)('', { [mediaType]: Object.assign({}, prepareMedia[mediaType]) }, { userJid: this.instance.wuid });
            }
            catch (error) {
                this.logger.error(error);
                throw new exceptions_1.InternalServerErrorException((error === null || error === void 0 ? void 0 : error.toString()) || error);
            }
        });
    }
    convertToWebP(image, number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('Converting image to WebP to sticker');
                let imagePath;
                const hash = `${number}-${new Date().getTime()}`;
                this.logger.verbose('Hash to image name: ' + hash);
                const outputPath = `${(0, path_1.join)(this.storePath, 'temp', `${hash}.webp`)}`;
                this.logger.verbose('Output path: ' + outputPath);
                if ((0, class_validator_1.isBase64)(image)) {
                    this.logger.verbose('Image is base64');
                    const base64Data = image.replace(/^data:image\/(jpeg|png|gif);base64,/, '');
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    imagePath = `${(0, path_1.join)(this.storePath, 'temp', `temp-${hash}.png`)}`;
                    this.logger.verbose('Image path: ' + imagePath);
                    yield (0, sharp_1.default)(imageBuffer).toFile(imagePath);
                    this.logger.verbose('Image created');
                }
                else {
                    this.logger.verbose('Image is url');
                    const timestamp = new Date().getTime();
                    const url = `${image}?timestamp=${timestamp}`;
                    this.logger.verbose('including timestamp in url: ' + url);
                    const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
                    this.logger.verbose('Getting image from url');
                    const imageBuffer = Buffer.from(response.data, 'binary');
                    imagePath = `${(0, path_1.join)(this.storePath, 'temp', `temp-${hash}.png`)}`;
                    this.logger.verbose('Image path: ' + imagePath);
                    yield (0, sharp_1.default)(imageBuffer).toFile(imagePath);
                    this.logger.verbose('Image created');
                }
                yield (0, sharp_1.default)(imagePath).webp().toFile(outputPath);
                this.logger.verbose('Image converted to WebP');
                fs_1.default.unlinkSync(imagePath);
                this.logger.verbose('Temp image deleted');
                return outputPath;
            }
            catch (error) {
                console.error('Erro ao converter a imagem para WebP:', error);
            }
        });
    }
    mediaSticker(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending media sticker');
            const convert = yield this.convertToWebP(data.stickerMessage.image, data.number);
            const result = yield this.sendMessageWithTyping(data.number, {
                sticker: { url: convert },
            }, data === null || data === void 0 ? void 0 : data.options);
            fs_1.default.unlinkSync(convert);
            this.logger.verbose('Converted image deleted');
            return result;
        });
    }
    mediaMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending media message');
            const generate = yield this.prepareMediaMessage(data.mediaMessage);
            return yield this.sendMessageWithTyping(data.number, Object.assign({}, generate.message), data === null || data === void 0 ? void 0 : data.options);
        });
    }
    processAudio(audio, number) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Processing audio');
            let tempAudioPath;
            let outputAudio;
            const hash = `${number}-${new Date().getTime()}`;
            this.logger.verbose('Hash to audio name: ' + hash);
            if ((0, class_validator_1.isURL)(audio)) {
                this.logger.verbose('Audio is url');
                outputAudio = `${(0, path_1.join)(this.storePath, 'temp', `${hash}.mp4`)}`;
                tempAudioPath = `${(0, path_1.join)(this.storePath, 'temp', `temp-${hash}.mp3`)}`;
                this.logger.verbose('Output audio path: ' + outputAudio);
                this.logger.verbose('Temp audio path: ' + tempAudioPath);
                const timestamp = new Date().getTime();
                const url = `${audio}?timestamp=${timestamp}`;
                this.logger.verbose('Including timestamp in url: ' + url);
                const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
                this.logger.verbose('Getting audio from url');
                fs_1.default.writeFileSync(tempAudioPath, response.data);
            }
            else {
                this.logger.verbose('Audio is base64');
                outputAudio = `${(0, path_1.join)(this.storePath, 'temp', `${hash}.mp4`)}`;
                tempAudioPath = `${(0, path_1.join)(this.storePath, 'temp', `temp-${hash}.mp3`)}`;
                this.logger.verbose('Output audio path: ' + outputAudio);
                this.logger.verbose('Temp audio path: ' + tempAudioPath);
                const audioBuffer = Buffer.from(audio, 'base64');
                fs_1.default.writeFileSync(tempAudioPath, audioBuffer);
                this.logger.verbose('Temp audio created');
            }
            this.logger.verbose('Converting audio to mp4');
            return new Promise((resolve, reject) => {
                (0, child_process_1.exec)(`${ffmpeg_1.default.path} -i ${tempAudioPath} -vn -ab 128k -ar 44100 -f ipod ${outputAudio} -y`, (error) => {
                    fs_1.default.unlinkSync(tempAudioPath);
                    this.logger.verbose('Temp audio deleted');
                    if (error)
                        reject(error);
                    this.logger.verbose('Audio converted to mp4');
                    resolve(outputAudio);
                });
            });
        });
    }
    audioWhatsapp(data) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending audio whatsapp');
            if (!((_a = data.options) === null || _a === void 0 ? void 0 : _a.encoding) && ((_b = data.options) === null || _b === void 0 ? void 0 : _b.encoding) !== false) {
                data.options.encoding = true;
            }
            if ((_c = data.options) === null || _c === void 0 ? void 0 : _c.encoding) {
                const convert = yield this.processAudio(data.audioMessage.audio, data.number);
                if (typeof convert === 'string') {
                    const audio = fs_1.default.readFileSync(convert).toString('base64');
                    const result = this.sendMessageWithTyping(data.number, {
                        audio: Buffer.from(audio, 'base64'),
                        ptt: true,
                        mimetype: 'audio/mp4',
                    }, { presence: 'recording', delay: (_d = data === null || data === void 0 ? void 0 : data.options) === null || _d === void 0 ? void 0 : _d.delay });
                    fs_1.default.unlinkSync(convert);
                    this.logger.verbose('Converted audio deleted');
                    return result;
                }
                else {
                    throw new exceptions_1.InternalServerErrorException(convert);
                }
            }
            return yield this.sendMessageWithTyping(data.number, {
                audio: (0, class_validator_1.isURL)(data.audioMessage.audio)
                    ? { url: data.audioMessage.audio }
                    : Buffer.from(data.audioMessage.audio, 'base64'),
                ptt: true,
                mimetype: 'audio/ogg; codecs=opus',
            }, { presence: 'recording', delay: (_e = data === null || data === void 0 ? void 0 : data.options) === null || _e === void 0 ? void 0 : _e.delay });
        });
    }
    buttonMessage(data) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending button message');
            const embeddedMedia = {};
            let mediatype = 'TEXT';
            if ((_a = data.buttonMessage) === null || _a === void 0 ? void 0 : _a.mediaMessage) {
                mediatype = (_c = (_b = data.buttonMessage.mediaMessage) === null || _b === void 0 ? void 0 : _b.mediatype.toUpperCase()) !== null && _c !== void 0 ? _c : 'TEXT';
                embeddedMedia.mediaKey = mediatype.toLowerCase() + 'Message';
                const generate = yield this.prepareMediaMessage(data.buttonMessage.mediaMessage);
                embeddedMedia.message = generate.message[embeddedMedia.mediaKey];
                embeddedMedia.contentText = `*${data.buttonMessage.title}*\n\n${data.buttonMessage.description}`;
            }
            const btnItems = {
                text: data.buttonMessage.buttons.map((btn) => btn.buttonText),
                ids: data.buttonMessage.buttons.map((btn) => btn.buttonId),
            };
            if (!(0, class_validator_1.arrayUnique)(btnItems.text) || !(0, class_validator_1.arrayUnique)(btnItems.ids)) {
                throw new exceptions_1.BadRequestException('Button texts cannot be repeated', 'Button IDs cannot be repeated.');
            }
            return yield this.sendMessageWithTyping(data.number, {
                buttonsMessage: {
                    text: !(embeddedMedia === null || embeddedMedia === void 0 ? void 0 : embeddedMedia.mediaKey) ? data.buttonMessage.title : undefined,
                    contentText: (_d = embeddedMedia === null || embeddedMedia === void 0 ? void 0 : embeddedMedia.contentText) !== null && _d !== void 0 ? _d : data.buttonMessage.description,
                    footerText: (_e = data.buttonMessage) === null || _e === void 0 ? void 0 : _e.footerText,
                    buttons: data.buttonMessage.buttons.map((button) => {
                        return {
                            buttonText: {
                                displayText: button.buttonText,
                            },
                            buttonId: button.buttonId,
                            type: 1,
                        };
                    }),
                    headerType: baileys_1.proto.Message.ButtonsMessage.HeaderType[mediatype],
                    [embeddedMedia === null || embeddedMedia === void 0 ? void 0 : embeddedMedia.mediaKey]: embeddedMedia === null || embeddedMedia === void 0 ? void 0 : embeddedMedia.message,
                },
            }, data === null || data === void 0 ? void 0 : data.options);
        });
    }
    locationMessage(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending location message');
            return yield this.sendMessageWithTyping(data.number, {
                locationMessage: {
                    degreesLatitude: data.locationMessage.latitude,
                    degreesLongitude: data.locationMessage.longitude,
                    name: (_a = data.locationMessage) === null || _a === void 0 ? void 0 : _a.name,
                    address: (_b = data.locationMessage) === null || _b === void 0 ? void 0 : _b.address,
                },
            }, data === null || data === void 0 ? void 0 : data.options);
        });
    }
    listMessage(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending list message');
            return yield this.sendMessageWithTyping(data.number, {
                listMessage: {
                    title: data.listMessage.title,
                    description: data.listMessage.description,
                    buttonText: (_a = data.listMessage) === null || _a === void 0 ? void 0 : _a.buttonText,
                    footerText: (_b = data.listMessage) === null || _b === void 0 ? void 0 : _b.footerText,
                    sections: data.listMessage.sections,
                    listType: 1,
                },
            }, data === null || data === void 0 ? void 0 : data.options);
        });
    }
    contactMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending contact message');
            const message = {};
            const vcard = (contact) => {
                this.logger.verbose('Creating vcard');
                let result = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + `N:${contact.fullName}\n` + `FN:${contact.fullName}\n`;
                if (contact.organization) {
                    this.logger.verbose('Organization defined');
                    result += `ORG:${contact.organization};\n`;
                }
                if (contact.email) {
                    this.logger.verbose('Email defined');
                    result += `EMAIL:${contact.email}\n`;
                }
                if (contact.url) {
                    this.logger.verbose('Url defined');
                    result += `URL:${contact.url}\n`;
                }
                if (!contact.wuid) {
                    this.logger.verbose('Wuid defined');
                    contact.wuid = this.createJid(contact.phoneNumber);
                }
                result += `item1.TEL;waid=${contact.wuid}:${contact.phoneNumber}\n` + 'item1.X-ABLabel:Celular\n' + 'END:VCARD';
                this.logger.verbose('Vcard created');
                return result;
            };
            if (data.contactMessage.length === 1) {
                message.contactMessage = {
                    displayName: data.contactMessage[0].fullName,
                    vcard: vcard(data.contactMessage[0]),
                };
            }
            else {
                message.contactsArrayMessage = {
                    displayName: `${data.contactMessage.length} contacts`,
                    contacts: data.contactMessage.map((contact) => {
                        return {
                            displayName: contact.fullName,
                            vcard: vcard(contact),
                        };
                    }),
                };
            }
            return yield this.sendMessageWithTyping(data.number, Object.assign({}, message), data === null || data === void 0 ? void 0 : data.options);
        });
    }
    reactionMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending reaction message');
            return yield this.sendMessageWithTyping(data.reactionMessage.key.remoteJid, {
                reactionMessage: {
                    key: data.reactionMessage.key,
                    text: data.reactionMessage.reaction,
                },
            });
        });
    }
    whatsappNumber(data) {
        var _a, e_6, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Getting whatsapp number');
            const onWhatsapp = [];
            try {
                for (var _d = true, _e = __asyncValues(data.numbers), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const number = _c;
                        let jid = this.createJid(number);
                        if ((0, baileys_1.isJidGroup)(jid)) {
                            const group = yield this.findGroup({ groupJid: jid }, 'inner');
                            if (!group)
                                throw new exceptions_1.BadRequestException('Group not found');
                            onWhatsapp.push(new chat_dto_1.OnWhatsAppDto(group.id, !!(group === null || group === void 0 ? void 0 : group.id), group === null || group === void 0 ? void 0 : group.subject));
                        }
                        else {
                            jid = !jid.startsWith('+') ? `+${jid}` : jid;
                            const verify = yield this.client.onWhatsApp(jid);
                            const result = verify[0];
                            if (!result) {
                                onWhatsapp.push(new chat_dto_1.OnWhatsAppDto(jid, false));
                            }
                            else {
                                onWhatsapp.push(new chat_dto_1.OnWhatsAppDto(result.jid, result.exists));
                            }
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return onWhatsapp;
        });
    }
    markMessageAsRead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Marking message as read');
            try {
                const keys = [];
                data.read_messages.forEach((read) => {
                    if ((0, baileys_1.isJidGroup)(read.remoteJid) || (0, baileys_1.isJidUser)(read.remoteJid)) {
                        keys.push({
                            remoteJid: read.remoteJid,
                            fromMe: read.fromMe,
                            id: read.id,
                        });
                    }
                });
                yield this.client.readMessages(keys);
                return { message: 'Read messages', read: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Read messages fail', error.toString());
            }
        });
    }
    getLastMessage(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.fetchMessages({
                where: {
                    key: {
                        remoteJid: number,
                    },
                    owner: this.instance.name,
                },
            });
            let lastMessage = messages.pop();
            for (const message of messages) {
                if (message.messageTimestamp >= lastMessage.messageTimestamp) {
                    lastMessage = message;
                }
            }
            return lastMessage;
        });
    }
    archiveChat(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Archiving chat');
            try {
                let last_message = data.lastMessage;
                let number = data.chat;
                if (!last_message && number) {
                    last_message = yield this.getLastMessage(number);
                }
                else {
                    last_message = data.lastMessage;
                    last_message.messageTimestamp = (_a = last_message === null || last_message === void 0 ? void 0 : last_message.messageTimestamp) !== null && _a !== void 0 ? _a : Date.now();
                    number = (_b = last_message === null || last_message === void 0 ? void 0 : last_message.key) === null || _b === void 0 ? void 0 : _b.remoteJid;
                }
                if (!last_message || Object.keys(last_message).length === 0) {
                    throw new exceptions_1.NotFoundException('Last message not found');
                }
                yield this.client.chatModify({
                    archive: data.archive,
                    lastMessages: [last_message],
                }, this.createJid(number));
                return {
                    chatId: number,
                    archived: true,
                };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException({
                    archived: false,
                    message: ['An error occurred while archiving the chat. Open a calling.', error.toString()],
                });
            }
        });
    }
    deleteMessage(del) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Deleting message');
            try {
                return yield this.client.sendMessage(del.remoteJid, { delete: del });
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error while deleting message for everyone', error === null || error === void 0 ? void 0 : error.toString());
            }
        });
    }
    getBase64FromMediaMessage(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Getting base64 from media message');
            try {
                const m = data === null || data === void 0 ? void 0 : data.message;
                const convertToMp4 = (_a = data === null || data === void 0 ? void 0 : data.convertToMp4) !== null && _a !== void 0 ? _a : false;
                const msg = (m === null || m === void 0 ? void 0 : m.message) ? m : (yield this.getMessage(m.key, true));
                if (!msg) {
                    throw 'Message not found';
                }
                for (const subtype of wa_types_1.MessageSubtype) {
                    if (msg.message[subtype]) {
                        msg.message = msg.message[subtype].message;
                    }
                }
                let mediaMessage;
                let mediaType;
                for (const type of wa_types_1.TypeMediaMessage) {
                    mediaMessage = msg.message[type];
                    if (mediaMessage) {
                        mediaType = type;
                        break;
                    }
                }
                if (!mediaMessage) {
                    throw 'The message is not of the media type';
                }
                if (typeof mediaMessage['mediaKey'] === 'object') {
                    msg.message = JSON.parse(JSON.stringify(msg.message));
                }
                this.logger.verbose('Downloading media message');
                const buffer = yield (0, baileys_1.downloadMediaMessage)({ key: msg === null || msg === void 0 ? void 0 : msg.key, message: msg === null || msg === void 0 ? void 0 : msg.message }, 'buffer', {}, {
                    logger: (0, pino_1.default)({ level: 'error' }),
                    reuploadRequest: this.client.updateMediaMessage,
                });
                const typeMessage = (0, baileys_1.getContentType)(msg.message);
                if (convertToMp4 && typeMessage === 'audioMessage') {
                    this.logger.verbose('Converting audio to mp4');
                    const number = msg.key.remoteJid.split('@')[0];
                    const convert = yield this.processAudio(buffer.toString('base64'), number);
                    if (typeof convert === 'string') {
                        const audio = fs_1.default.readFileSync(convert).toString('base64');
                        this.logger.verbose('Audio converted to mp4');
                        const result = {
                            mediaType,
                            fileName: mediaMessage['fileName'],
                            caption: mediaMessage['caption'],
                            size: {
                                fileLength: mediaMessage['fileLength'],
                                height: mediaMessage['height'],
                                width: mediaMessage['width'],
                            },
                            mimetype: 'audio/mp4',
                            base64: Buffer.from(audio, 'base64').toString('base64'),
                        };
                        fs_1.default.unlinkSync(convert);
                        this.logger.verbose('Converted audio deleted');
                        this.logger.verbose('Media message downloaded');
                        return result;
                    }
                }
                this.logger.verbose('Media message downloaded');
                return {
                    mediaType,
                    fileName: mediaMessage['fileName'],
                    caption: mediaMessage['caption'],
                    size: {
                        fileLength: mediaMessage['fileLength'],
                        height: mediaMessage['height'],
                        width: mediaMessage['width'],
                    },
                    mimetype: mediaMessage['mimetype'],
                    base64: buffer.toString('base64'),
                };
            }
            catch (error) {
                this.logger.error(error);
                throw new exceptions_1.BadRequestException(error.toString());
            }
        });
    }
    fetchContacts(query) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching contacts');
            if (query === null || query === void 0 ? void 0 : query.where) {
                query.where.owner = this.instance.name;
                if ((_a = query.where) === null || _a === void 0 ? void 0 : _a.id) {
                    query.where.id = this.createJid(query.where.id);
                }
            }
            else {
                query = {
                    where: {
                        owner: this.instance.name,
                    },
                };
            }
            return yield this.repository.contact.find(query);
        });
    }
    fetchMessages(query) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching messages');
            if (query === null || query === void 0 ? void 0 : query.where) {
                if ((_b = (_a = query.where) === null || _a === void 0 ? void 0 : _a.key) === null || _b === void 0 ? void 0 : _b.remoteJid) {
                    query.where.key.remoteJid = this.createJid(query.where.key.remoteJid);
                }
                query.where.owner = this.instance.name;
            }
            else {
                query = {
                    where: {
                        owner: this.instance.name,
                    },
                    limit: query === null || query === void 0 ? void 0 : query.limit,
                };
            }
            return yield this.repository.message.find(query);
        });
    }
    fetchStatusMessage(query) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching status messages');
            if (query === null || query === void 0 ? void 0 : query.where) {
                if ((_a = query.where) === null || _a === void 0 ? void 0 : _a.remoteJid) {
                    query.where.remoteJid = this.createJid(query.where.remoteJid);
                }
                query.where.owner = this.instance.name;
            }
            else {
                query = {
                    where: {
                        owner: this.instance.name,
                    },
                    limit: query === null || query === void 0 ? void 0 : query.limit,
                };
            }
            return yield this.repository.messageUpdate.find(query);
        });
    }
    fetchChats() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching chats');
            return yield this.repository.chat.find({ where: { owner: this.instance.name } });
        });
    }
    fetchPrivacySettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching privacy settings');
            return yield this.client.fetchPrivacySettings();
        });
    }
    updatePrivacySettings(settings) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating privacy settings');
            try {
                yield this.client.updateReadReceiptsPrivacy(settings.privacySettings.readreceipts);
                this.logger.verbose('Read receipts privacy updated');
                yield this.client.updateProfilePicturePrivacy(settings.privacySettings.profile);
                this.logger.verbose('Profile picture privacy updated');
                yield this.client.updateStatusPrivacy(settings.privacySettings.status);
                this.logger.verbose('Status privacy updated');
                yield this.client.updateOnlinePrivacy(settings.privacySettings.online);
                this.logger.verbose('Online privacy updated');
                yield this.client.updateLastSeenPrivacy(settings.privacySettings.last);
                this.logger.verbose('Last seen privacy updated');
                yield this.client.updateGroupsAddPrivacy(settings.privacySettings.groupadd);
                this.logger.verbose('Groups add privacy updated');
                (_b = (_a = this.client) === null || _a === void 0 ? void 0 : _a.ws) === null || _b === void 0 ? void 0 : _b.close();
                return {
                    update: 'success',
                    data: {
                        readreceipts: settings.privacySettings.readreceipts,
                        profile: settings.privacySettings.profile,
                        status: settings.privacySettings.status,
                        online: settings.privacySettings.online,
                        last: settings.privacySettings.last,
                        groupadd: settings.privacySettings.groupadd,
                    },
                };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error updating privacy settings', error.toString());
            }
        });
    }
    fetchBusinessProfile(number) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching business profile');
            try {
                const jid = number ? this.createJid(number) : this.instance.wuid;
                const profile = yield this.client.getBusinessProfile(jid);
                this.logger.verbose('Trying to get business profile');
                if (!profile) {
                    const info = yield this.whatsappNumber({ numbers: [jid] });
                    return Object.assign({ isBusiness: false, message: 'Not is business profile' }, info === null || info === void 0 ? void 0 : info.shift());
                }
                this.logger.verbose('Business profile fetched');
                return Object.assign({ isBusiness: true }, profile);
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error updating profile name', error.toString());
            }
        });
    }
    updateProfileName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating profile name to ' + name);
            try {
                yield this.client.updateProfileName(name);
                return { update: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error updating profile name', error.toString());
            }
        });
    }
    updateProfileStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating profile status to: ' + status);
            try {
                yield this.client.updateProfileStatus(status);
                return { update: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error updating profile status', error.toString());
            }
        });
    }
    updateProfilePicture(picture) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating profile picture');
            try {
                let pic;
                if ((0, class_validator_1.isURL)(picture)) {
                    this.logger.verbose('Picture is url');
                    const timestamp = new Date().getTime();
                    const url = `${picture}?timestamp=${timestamp}`;
                    this.logger.verbose('Including timestamp in url: ' + url);
                    pic = (yield axios_1.default.get(url, { responseType: 'arraybuffer' })).data;
                    this.logger.verbose('Getting picture from url');
                }
                else if ((0, class_validator_1.isBase64)(picture)) {
                    this.logger.verbose('Picture is base64');
                    pic = Buffer.from(picture, 'base64');
                    this.logger.verbose('Getting picture from base64');
                }
                else {
                    throw new exceptions_1.BadRequestException('"profilePicture" must be a url or a base64');
                }
                yield this.client.updateProfilePicture(this.instance.wuid, pic);
                this.logger.verbose('Profile picture updated');
                return { update: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error updating profile picture', error.toString());
            }
        });
    }
    removeProfilePicture() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Removing profile picture');
            try {
                yield this.client.removeProfilePicture(this.instance.wuid);
                return { update: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error removing profile picture', error.toString());
            }
        });
    }
    createGroup(create) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Creating group: ' + create.subject);
            try {
                const participants = create.participants.map((p) => this.createJid(p));
                const { id } = yield this.client.groupCreate(create.subject, participants);
                this.logger.verbose('Group created: ' + id);
                if (create === null || create === void 0 ? void 0 : create.description) {
                    this.logger.verbose('Updating group description: ' + create.description);
                    yield this.client.groupUpdateDescription(id, create.description);
                }
                if (create === null || create === void 0 ? void 0 : create.promoteParticipants) {
                    this.logger.verbose('Prometing group participants: ' + create.description);
                    yield this.updateGParticipant({
                        groupJid: id,
                        action: 'promote',
                        participants: participants,
                    });
                }
                const group = yield this.client.groupMetadata(id);
                this.logger.verbose('Getting group metadata');
                return group;
            }
            catch (error) {
                this.logger.error(error);
                throw new exceptions_1.InternalServerErrorException('Error creating group', error.toString());
            }
        });
    }
    updateGroupPicture(picture) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating group picture');
            try {
                let pic;
                if ((0, class_validator_1.isURL)(picture.image)) {
                    this.logger.verbose('Picture is url');
                    const timestamp = new Date().getTime();
                    const url = `${picture.image}?timestamp=${timestamp}`;
                    this.logger.verbose('Including timestamp in url: ' + url);
                    pic = (yield axios_1.default.get(url, { responseType: 'arraybuffer' })).data;
                    this.logger.verbose('Getting picture from url');
                }
                else if ((0, class_validator_1.isBase64)(picture.image)) {
                    this.logger.verbose('Picture is base64');
                    pic = Buffer.from(picture.image, 'base64');
                    this.logger.verbose('Getting picture from base64');
                }
                else {
                    throw new exceptions_1.BadRequestException('"profilePicture" must be a url or a base64');
                }
                yield this.client.updateProfilePicture(picture.groupJid, pic);
                this.logger.verbose('Group picture updated');
                return { update: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error update group picture', error.toString());
            }
        });
    }
    updateGroupSubject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating group subject to: ' + data.subject);
            try {
                yield this.client.groupUpdateSubject(data.groupJid, data.subject);
                return { update: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error updating group subject', error.toString());
            }
        });
    }
    updateGroupDescription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating group description to: ' + data.description);
            try {
                yield this.client.groupUpdateDescription(data.groupJid, data.description);
                return { update: 'success' };
            }
            catch (error) {
                throw new exceptions_1.InternalServerErrorException('Error updating group description', error.toString());
            }
        });
    }
    findGroup(id, reply = 'out') {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching group');
            try {
                return yield this.client.groupMetadata(id.groupJid);
            }
            catch (error) {
                if (reply === 'inner') {
                    return;
                }
                throw new exceptions_1.NotFoundException('Error fetching group', error.toString());
            }
        });
    }
    fetchAllGroups(getParticipants) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching all groups');
            try {
                const fetch = Object.values(yield this.client.groupFetchAllParticipating());
                const groups = fetch.map((group) => {
                    const result = {
                        id: group.id,
                        subject: group.subject,
                        subjectOwner: group.subjectOwner,
                        subjectTime: group.subjectTime,
                        size: group.size,
                        creation: group.creation,
                        owner: group.owner,
                        desc: group.desc,
                        descId: group.descId,
                        restrict: group.restrict,
                        announce: group.announce,
                    };
                    if (getParticipants.getParticipants == 'true') {
                        result['participants'] = group.participants;
                    }
                    return result;
                });
                return groups;
            }
            catch (error) {
                throw new exceptions_1.NotFoundException('Error fetching group', error.toString());
            }
        });
    }
    inviteCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching invite code for group: ' + id.groupJid);
            try {
                const code = yield this.client.groupInviteCode(id.groupJid);
                return { inviteUrl: `https://chat.whatsapp.com/${code}`, inviteCode: code };
            }
            catch (error) {
                throw new exceptions_1.NotFoundException('No invite code', error.toString());
            }
        });
    }
    inviteInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching invite info for code: ' + id.inviteCode);
            try {
                return yield this.client.groupGetInviteInfo(id.inviteCode);
            }
            catch (error) {
                throw new exceptions_1.NotFoundException('No invite info', id.inviteCode);
            }
        });
    }
    sendInvite(id) {
        var _a, e_7, _b, _c;
        var _d;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Sending invite for group: ' + id.groupJid);
            try {
                const inviteCode = yield this.inviteCode({ groupJid: id.groupJid });
                this.logger.verbose('Getting invite code: ' + inviteCode.inviteCode);
                const inviteUrl = inviteCode.inviteUrl;
                this.logger.verbose('Invite url: ' + inviteUrl);
                const numbers = id.numbers.map((number) => this.createJid(number));
                const description = (_d = id.description) !== null && _d !== void 0 ? _d : '';
                const msg = `${description}\n\n${inviteUrl}`;
                const message = {
                    conversation: msg,
                };
                try {
                    for (var _e = true, numbers_1 = __asyncValues(numbers), numbers_1_1; numbers_1_1 = yield numbers_1.next(), _a = numbers_1_1.done, !_a;) {
                        _c = numbers_1_1.value;
                        _e = false;
                        try {
                            const number = _c;
                            yield this.sendMessageWithTyping(number, message);
                        }
                        finally {
                            _e = true;
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (!_e && !_a && (_b = numbers_1.return)) yield _b.call(numbers_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                this.logger.verbose('Invite sent for numbers: ' + numbers.join(', '));
                return { send: true, inviteUrl };
            }
            catch (error) {
                throw new exceptions_1.NotFoundException('No send invite');
            }
        });
    }
    revokeInviteCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Revoking invite code for group: ' + id.groupJid);
            try {
                const inviteCode = yield this.client.groupRevokeInvite(id.groupJid);
                return { revoked: true, inviteCode };
            }
            catch (error) {
                throw new exceptions_1.NotFoundException('Revoke error', error.toString());
            }
        });
    }
    findParticipants(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Fetching participants for group: ' + id.groupJid);
            try {
                const participants = (yield this.client.groupMetadata(id.groupJid)).participants;
                return { participants };
            }
            catch (error) {
                throw new exceptions_1.NotFoundException('No participants', error.toString());
            }
        });
    }
    updateGParticipant(update) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating participants');
            try {
                const participants = update.participants.map((p) => this.createJid(p));
                const updateParticipants = yield this.client.groupParticipantsUpdate(update.groupJid, participants, update.action);
                return { updateParticipants: updateParticipants };
            }
            catch (error) {
                throw new exceptions_1.BadRequestException('Error updating participants', error.toString());
            }
        });
    }
    updateGSetting(update) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Updating setting for group: ' + update.groupJid);
            try {
                const updateSetting = yield this.client.groupSettingUpdate(update.groupJid, update.action);
                return { updateSetting: updateSetting };
            }
            catch (error) {
                throw new exceptions_1.BadRequestException('Error updating setting', error.toString());
            }
        });
    }
    toggleEphemeral(update) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Toggling ephemeral for group: ' + update.groupJid);
            try {
                yield this.client.groupToggleEphemeral(update.groupJid, update.expiration);
                return { success: true };
            }
            catch (error) {
                throw new exceptions_1.BadRequestException('Error updating setting', error.toString());
            }
        });
    }
    leaveGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('Leaving group: ' + id.groupJid);
            try {
                yield this.client.groupLeave(id.groupJid);
                return { groupJid: id.groupJid, leave: true };
            }
            catch (error) {
                throw new exceptions_1.BadRequestException('Unable to leave the group', error.toString());
            }
        });
    }
}
exports.WAStartupService = WAStartupService;
