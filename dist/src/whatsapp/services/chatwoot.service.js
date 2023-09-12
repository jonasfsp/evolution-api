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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatwootService = void 0;
const chatwoot_sdk_1 = __importDefault(require("@figuro/chatwoot-sdk"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = require("fs");
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const logger_config_1 = require("../../config/logger.config");
const path_config_1 = require("../../config/path.config");
class ChatwootService {
    constructor(waMonitor, configService) {
        this.waMonitor = waMonitor;
        this.configService = configService;
        this.logger = new logger_config_1.Logger(ChatwootService.name);
        this.messageCache = new Set();
    }
    loadMessageCache() {
        this.logger.verbose('load message cache');
        try {
            const cacheData = (0, fs_1.readFileSync)(this.messageCacheFile, 'utf-8');
            const cacheArray = cacheData.split('\n');
            return new Set(cacheArray);
        }
        catch (error) {
            return new Set();
        }
    }
    saveMessageCache() {
        this.logger.verbose('save message cache');
        const cacheData = Array.from(this.messageCache).join('\n');
        (0, fs_1.writeFileSync)(this.messageCacheFile, cacheData, 'utf-8');
        this.logger.verbose('message cache saved');
    }
    clearMessageCache() {
        this.logger.verbose('clear message cache');
        this.messageCache.clear();
        this.saveMessageCache();
    }
    getProvider(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('get provider to instance: ' + instance.instanceName);
            try {
                const provider = yield this.waMonitor.waInstances[instance.instanceName].findChatwoot();
                if (!provider) {
                    this.logger.warn('provider not found');
                    return null;
                }
                this.logger.verbose('provider found');
                return provider;
            }
            catch (error) {
                this.logger.error('provider not found');
                return null;
            }
        });
    }
    clientCw(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('get client to instance: ' + instance.instanceName);
            const provider = yield this.getProvider(instance);
            if (!provider) {
                this.logger.error('provider not found');
                return null;
            }
            this.logger.verbose('provider found');
            this.provider = provider;
            this.logger.verbose('create client to instance: ' + instance.instanceName);
            const client = new chatwoot_sdk_1.default({
                config: {
                    basePath: provider.url,
                    with_credentials: true,
                    credentials: 'include',
                    token: provider.token,
                },
            });
            this.logger.verbose('client created');
            return client;
        });
    }
    create(instance, data) {
        this.logger.verbose('create chatwoot: ' + instance.instanceName);
        this.waMonitor.waInstances[instance.instanceName].setChatwoot(data);
        this.logger.verbose('chatwoot created');
        return data;
    }
    find(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('find chatwoot: ' + instance.instanceName);
            try {
                return yield this.waMonitor.waInstances[instance.instanceName].findChatwoot();
            }
            catch (error) {
                this.logger.error('chatwoot not found');
                return { enabled: null, url: '' };
            }
        });
    }
    getContact(instance, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('get contact to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            if (!id) {
                this.logger.warn('id is required');
                return null;
            }
            this.logger.verbose('find contact in chatwoot');
            const contact = yield client.contact.getContactable({
                accountId: this.provider.account_id,
                id,
            });
            if (!contact) {
                this.logger.warn('contact not found');
                return null;
            }
            this.logger.verbose('contact found');
            return contact;
        });
    }
    initInstanceChatwoot(instance, inboxName, webhookUrl, qrcode, number) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('init instance chatwoot: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            this.logger.verbose('find inbox in chatwoot');
            const findInbox = yield client.inboxes.list({
                accountId: this.provider.account_id,
            });
            this.logger.verbose('check duplicate inbox');
            const checkDuplicate = findInbox.payload.map((inbox) => inbox.name).includes(inboxName);
            let inboxId;
            if (!checkDuplicate) {
                this.logger.verbose('create inbox in chatwoot');
                const data = {
                    type: 'api',
                    webhook_url: webhookUrl,
                };
                const inbox = yield client.inboxes.create({
                    accountId: this.provider.account_id,
                    data: {
                        name: inboxName,
                        channel: data,
                    },
                });
                if (!inbox) {
                    this.logger.warn('inbox not found');
                    return null;
                }
                inboxId = inbox.id;
            }
            else {
                this.logger.verbose('find inbox in chatwoot');
                const inbox = findInbox.payload.find((inbox) => inbox.name === inboxName);
                if (!inbox) {
                    this.logger.warn('inbox not found');
                    return null;
                }
                inboxId = inbox.id;
            }
            this.logger.verbose('find contact in chatwoot and create if not exists');
            const contact = (yield this.findContact(instance, '123456')) ||
                (yield this.createContact(instance, '123456', inboxId, false, 'EvolutionAPI', 'https://evolution-api.com/files/evolution-api-favicon.png'));
            if (!contact) {
                this.logger.warn('contact not found');
                return null;
            }
            const contactId = contact.id || contact.payload.contact.id;
            if (qrcode) {
                this.logger.verbose('create conversation in chatwoot');
                const data = {
                    contact_id: contactId.toString(),
                    inbox_id: inboxId.toString(),
                };
                if (this.provider.conversation_pending) {
                    data['status'] = 'pending';
                }
                const conversation = yield client.conversations.create({
                    accountId: this.provider.account_id,
                    data,
                });
                if (!conversation) {
                    this.logger.warn('conversation not found');
                    return null;
                }
                this.logger.verbose('create message for init instance in chatwoot');
                let contentMsg = 'init';
                if (number) {
                    contentMsg = `init:${number}`;
                }
                const message = yield client.messages.create({
                    accountId: this.provider.account_id,
                    conversationId: conversation.id,
                    data: {
                        content: contentMsg,
                        message_type: 'outgoing',
                    },
                });
                if (!message) {
                    this.logger.warn('conversation not found');
                    return null;
                }
            }
            this.logger.verbose('instance chatwoot initialized');
            return true;
        });
    }
    createContact(instance, phoneNumber, inboxId, isGroup, name, avatar_url, jid) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('create contact to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            let data = {};
            if (!isGroup) {
                this.logger.verbose('create contact in chatwoot');
                data = {
                    inbox_id: inboxId,
                    name: name || phoneNumber,
                    phone_number: `+${phoneNumber}`,
                    identifier: jid,
                    avatar_url: avatar_url,
                };
            }
            else {
                this.logger.verbose('create contact group in chatwoot');
                data = {
                    inbox_id: inboxId,
                    name: name || phoneNumber,
                    identifier: phoneNumber,
                    avatar_url: avatar_url,
                };
            }
            this.logger.verbose('create contact in chatwoot');
            const contact = yield client.contacts.create({
                accountId: this.provider.account_id,
                data,
            });
            if (!contact) {
                this.logger.warn('contact not found');
                return null;
            }
            this.logger.verbose('contact created');
            return contact;
        });
    }
    updateContact(instance, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('update contact to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            if (!id) {
                this.logger.warn('id is required');
                return null;
            }
            this.logger.verbose('update contact in chatwoot');
            const contact = yield client.contacts.update({
                accountId: this.provider.account_id,
                id,
                data,
            });
            this.logger.verbose('contact updated');
            return contact;
        });
    }
    findContact(instance, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('find contact to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            let query;
            if (!phoneNumber.includes('@g.us')) {
                this.logger.verbose('format phone number');
                query = `+${phoneNumber}`;
            }
            else {
                this.logger.verbose('format group id');
                query = phoneNumber;
            }
            this.logger.verbose('find contact in chatwoot');
            const contact = yield client.contacts.search({
                accountId: this.provider.account_id,
                q: query,
            });
            if (!contact) {
                this.logger.warn('contact not found');
                return null;
            }
            if (!phoneNumber.includes('@g.us')) {
                this.logger.verbose('return contact');
                return contact.payload.find((contact) => contact.phone_number === query);
            }
            else {
                this.logger.verbose('return group');
                return contact.payload.find((contact) => contact.identifier === query);
            }
        });
    }
    createConversation(instance, body) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('create conversation to instance: ' + instance.instanceName);
            try {
                const client = yield this.clientCw(instance);
                if (!client) {
                    this.logger.warn('client not found');
                    return null;
                }
                const isGroup = body.key.remoteJid.includes('@g.us');
                this.logger.verbose('is group: ' + isGroup);
                const chatId = isGroup ? body.key.remoteJid : body.key.remoteJid.split('@')[0];
                this.logger.verbose('chat id: ' + chatId);
                let nameContact;
                nameContact = !body.key.fromMe ? body.pushName : chatId;
                this.logger.verbose('get inbox to instance: ' + instance.instanceName);
                const filterInbox = yield this.getInbox(instance);
                if (!filterInbox) {
                    this.logger.warn('inbox not found');
                    return null;
                }
                if (isGroup) {
                    this.logger.verbose('get group name');
                    const group = yield this.waMonitor.waInstances[instance.instanceName].client.groupMetadata(chatId);
                    nameContact = `${group.subject} (GROUP)`;
                    this.logger.verbose('find or create participant in chatwoot');
                    const picture_url = yield this.waMonitor.waInstances[instance.instanceName].profilePicture(body.key.participant.split('@')[0]);
                    const findParticipant = yield this.findContact(instance, body.key.participant.split('@')[0]);
                    if (findParticipant) {
                        if (!findParticipant.name || findParticipant.name === chatId) {
                            yield this.updateContact(instance, findParticipant.id, {
                                name: body.pushName,
                                avatar_url: picture_url.profilePictureUrl || null,
                            });
                        }
                    }
                    else {
                        yield this.createContact(instance, body.key.participant.split('@')[0], filterInbox.id, false, body.pushName, picture_url.profilePictureUrl || null, body.key.participant);
                    }
                }
                this.logger.verbose('find or create contact in chatwoot');
                const picture_url = yield this.waMonitor.waInstances[instance.instanceName].profilePicture(chatId);
                const findContact = yield this.findContact(instance, chatId);
                let contact;
                if (body.key.fromMe) {
                    if (findContact) {
                        contact = findContact;
                    }
                    else {
                        const jid = isGroup ? null : body.key.remoteJid;
                        contact = yield this.createContact(instance, chatId, filterInbox.id, isGroup, nameContact, picture_url.profilePictureUrl || null, jid);
                    }
                }
                else {
                    if (findContact) {
                        if (!findContact.name || findContact.name === chatId) {
                            contact = yield this.updateContact(instance, findContact.id, {
                                name: nameContact,
                                avatar_url: picture_url.profilePictureUrl || null,
                            });
                        }
                        else {
                            contact = findContact;
                        }
                    }
                    else {
                        const jid = isGroup ? null : body.key.remoteJid;
                        contact = yield this.createContact(instance, chatId, filterInbox.id, isGroup, nameContact, picture_url.profilePictureUrl || null, jid);
                    }
                }
                if (!contact) {
                    this.logger.warn('contact not found');
                    return null;
                }
                const contactId = ((_a = contact === null || contact === void 0 ? void 0 : contact.payload) === null || _a === void 0 ? void 0 : _a.id) || ((_c = (_b = contact === null || contact === void 0 ? void 0 : contact.payload) === null || _b === void 0 ? void 0 : _b.contact) === null || _c === void 0 ? void 0 : _c.id) || (contact === null || contact === void 0 ? void 0 : contact.id);
                if (!body.key.fromMe && contact.name === chatId && nameContact !== chatId) {
                    this.logger.verbose('update contact name in chatwoot');
                    yield this.updateContact(instance, contactId, {
                        name: nameContact,
                    });
                }
                this.logger.verbose('get contact conversations in chatwoot');
                const contactConversations = (yield client.contacts.listConversations({
                    accountId: this.provider.account_id,
                    id: contactId,
                }));
                if (contactConversations) {
                    let conversation;
                    if (this.provider.reopen_conversation) {
                        conversation = contactConversations.payload.find((conversation) => conversation.inbox_id == filterInbox.id);
                        if (this.provider.conversation_pending) {
                            yield client.conversations.toggleStatus({
                                accountId: this.provider.account_id,
                                conversationId: conversation.id,
                                data: {
                                    status: 'pending',
                                },
                            });
                        }
                    }
                    else {
                        conversation = contactConversations.payload.find((conversation) => conversation.status !== 'resolved' && conversation.inbox_id == filterInbox.id);
                    }
                    this.logger.verbose('return conversation if exists');
                    if (conversation) {
                        this.logger.verbose('conversation found');
                        return conversation.id;
                    }
                }
                this.logger.verbose('create conversation in chatwoot');
                const data = {
                    contact_id: contactId.toString(),
                    inbox_id: filterInbox.id.toString(),
                };
                if (this.provider.conversation_pending) {
                    data['status'] = 'pending';
                }
                const conversation = yield client.conversations.create({
                    accountId: this.provider.account_id,
                    data,
                });
                if (!conversation) {
                    this.logger.warn('conversation not found');
                    return null;
                }
                this.logger.verbose('conversation created');
                return conversation.id;
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    getInbox(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('get inbox to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            this.logger.verbose('find inboxes in chatwoot');
            const inbox = (yield client.inboxes.list({
                accountId: this.provider.account_id,
            }));
            if (!inbox) {
                this.logger.warn('inbox not found');
                return null;
            }
            this.logger.verbose('find inbox by name');
            const findByName = inbox.payload.find((inbox) => inbox.name === instance.instanceName.split('-cwId-')[0]);
            if (!findByName) {
                this.logger.warn('inbox not found');
                return null;
            }
            this.logger.verbose('return inbox');
            return findByName;
        });
    }
    createMessage(instance, conversationId, content, messageType, privateMessage, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('create message to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            this.logger.verbose('create message in chatwoot');
            const message = yield client.messages.create({
                accountId: this.provider.account_id,
                conversationId: conversationId,
                data: {
                    content: content,
                    message_type: messageType,
                    attachments: attachments,
                    private: privateMessage || false,
                },
            });
            if (!message) {
                this.logger.warn('message not found');
                return null;
            }
            this.logger.verbose('message created');
            return message;
        });
    }
    createBotMessage(instance, content, messageType, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('create bot message to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            this.logger.verbose('find contact in chatwoot');
            const contact = yield this.findContact(instance, '123456');
            if (!contact) {
                this.logger.warn('contact not found');
                return null;
            }
            this.logger.verbose('get inbox to instance: ' + instance.instanceName);
            const filterInbox = yield this.getInbox(instance);
            if (!filterInbox) {
                this.logger.warn('inbox not found');
                return null;
            }
            this.logger.verbose('find conversation in chatwoot');
            const findConversation = yield client.conversations.list({
                accountId: this.provider.account_id,
                inboxId: filterInbox.id,
            });
            if (!findConversation) {
                this.logger.warn('conversation not found');
                return null;
            }
            this.logger.verbose('find conversation by contact id');
            const conversation = findConversation.data.payload.find((conversation) => { var _a, _b; return ((_b = (_a = conversation === null || conversation === void 0 ? void 0 : conversation.meta) === null || _a === void 0 ? void 0 : _a.sender) === null || _b === void 0 ? void 0 : _b.id) === contact.id && conversation.status === 'open'; });
            if (!conversation) {
                this.logger.warn('conversation not found');
                return;
            }
            this.logger.verbose('create message in chatwoot');
            const message = yield client.messages.create({
                accountId: this.provider.account_id,
                conversationId: conversation.id,
                data: {
                    content: content,
                    message_type: messageType,
                    attachments: attachments,
                },
            });
            if (!message) {
                this.logger.warn('message not found');
                return null;
            }
            this.logger.verbose('bot message created');
            return message;
        });
    }
    sendData(conversationId, file, messageType, content) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('send data to chatwoot');
            const data = new form_data_1.default();
            if (content) {
                this.logger.verbose('content found');
                data.append('content', content);
            }
            this.logger.verbose('message type: ' + messageType);
            data.append('message_type', messageType);
            this.logger.verbose('temp file found');
            data.append('attachments[]', (0, fs_1.createReadStream)(file));
            this.logger.verbose('get client to instance: ' + this.provider.instanceName);
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.provider.url}/api/v1/accounts/${this.provider.account_id}/conversations/${conversationId}/messages`,
                headers: Object.assign({ api_access_token: this.provider.token }, data.getHeaders()),
                data: data,
            };
            this.logger.verbose('send data to chatwoot');
            try {
                const { data } = yield axios_1.default.request(config);
                this.logger.verbose('remove temp file');
                (0, fs_1.unlinkSync)(file);
                this.logger.verbose('data sent');
                return data;
            }
            catch (error) {
                this.logger.error(error);
                (0, fs_1.unlinkSync)(file);
            }
        });
    }
    createBotQr(instance, content, messageType, file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('create bot qr to instance: ' + instance.instanceName);
            const client = yield this.clientCw(instance);
            if (!client) {
                this.logger.warn('client not found');
                return null;
            }
            this.logger.verbose('find contact in chatwoot');
            const contact = yield this.findContact(instance, '123456');
            if (!contact) {
                this.logger.warn('contact not found');
                return null;
            }
            this.logger.verbose('get inbox to instance: ' + instance.instanceName);
            const filterInbox = yield this.getInbox(instance);
            if (!filterInbox) {
                this.logger.warn('inbox not found');
                return null;
            }
            this.logger.verbose('find conversation in chatwoot');
            const findConversation = yield client.conversations.list({
                accountId: this.provider.account_id,
                inboxId: filterInbox.id,
            });
            if (!findConversation) {
                this.logger.warn('conversation not found');
                return null;
            }
            this.logger.verbose('find conversation by contact id');
            const conversation = findConversation.data.payload.find((conversation) => { var _a, _b; return ((_b = (_a = conversation === null || conversation === void 0 ? void 0 : conversation.meta) === null || _a === void 0 ? void 0 : _a.sender) === null || _b === void 0 ? void 0 : _b.id) === contact.id && conversation.status === 'open'; });
            if (!conversation) {
                this.logger.warn('conversation not found');
                return;
            }
            this.logger.verbose('send data to chatwoot');
            const data = new form_data_1.default();
            if (content) {
                this.logger.verbose('content found');
                data.append('content', content);
            }
            this.logger.verbose('message type: ' + messageType);
            data.append('message_type', messageType);
            if (file) {
                this.logger.verbose('temp file found');
                data.append('attachments[]', (0, fs_1.createReadStream)(file));
            }
            this.logger.verbose('get client to instance: ' + this.provider.instanceName);
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.provider.url}/api/v1/accounts/${this.provider.account_id}/conversations/${conversation.id}/messages`,
                headers: Object.assign({ api_access_token: this.provider.token }, data.getHeaders()),
                data: data,
            };
            this.logger.verbose('send data to chatwoot');
            try {
                const { data } = yield axios_1.default.request(config);
                this.logger.verbose('remove temp file');
                (0, fs_1.unlinkSync)(file);
                this.logger.verbose('data sent');
                return data;
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    sendAttachment(waInstance, number, media, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('send attachment to instance: ' + waInstance.instanceName);
            try {
                this.logger.verbose('get media type');
                const parts = media.split('/');
                const fileName = decodeURIComponent(parts[parts.length - 1]);
                this.logger.verbose('file name: ' + fileName);
                const mimeType = mime_types_1.default.lookup(fileName).toString();
                this.logger.verbose('mime type: ' + mimeType);
                let type = 'document';
                switch (mimeType.split('/')[0]) {
                    case 'image':
                        type = 'image';
                        break;
                    case 'video':
                        type = 'video';
                        break;
                    case 'audio':
                        type = 'audio';
                        break;
                    default:
                        type = 'document';
                        break;
                }
                this.logger.verbose('type: ' + type);
                if (type === 'audio') {
                    this.logger.verbose('send audio to instance: ' + waInstance.instanceName);
                    const data = {
                        number: number,
                        audioMessage: {
                            audio: media,
                        },
                        options: {
                            delay: 1200,
                            presence: 'recording',
                        },
                    };
                    yield (waInstance === null || waInstance === void 0 ? void 0 : waInstance.audioWhatsapp(data));
                    this.logger.verbose('audio sent');
                    return;
                }
                this.logger.verbose('send media to instance: ' + waInstance.instanceName);
                const data = {
                    number: number,
                    mediaMessage: {
                        mediatype: type,
                        fileName: fileName,
                        media: media,
                    },
                    options: {
                        delay: 1200,
                        presence: 'composing',
                    },
                };
                if (caption) {
                    this.logger.verbose('caption found');
                    data.mediaMessage.caption = caption;
                }
                yield (waInstance === null || waInstance === void 0 ? void 0 : waInstance.mediaMessage(data));
                this.logger.verbose('media sent');
                return;
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    receiveWebhook(instance, body) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('receive webhook to chatwoot instance: ' + instance.instanceName);
                const client = yield this.clientCw(instance);
                if (!client) {
                    this.logger.warn('client not found');
                    return null;
                }
                this.logger.verbose('check if is bot');
                if (!(body === null || body === void 0 ? void 0 : body.conversation) || body.private || body.event === 'message_updated')
                    return { message: 'bot' };
                this.logger.verbose('check if is group');
                const chatId = ((_b = (_a = body.conversation.meta.sender) === null || _a === void 0 ? void 0 : _a.phone_number) === null || _b === void 0 ? void 0 : _b.replace('+', '')) || ((_c = body.conversation.meta.sender) === null || _c === void 0 ? void 0 : _c.identifier);
                const messageReceived = body.content;
                const senderName = (_d = body === null || body === void 0 ? void 0 : body.sender) === null || _d === void 0 ? void 0 : _d.name;
                const waInstance = this.waMonitor.waInstances[instance.instanceName];
                if (chatId === '123456' && body.message_type === 'outgoing') {
                    this.logger.verbose('check if is command');
                    const command = messageReceived.replace('/', '');
                    if (command.includes('init') || command.includes('iniciar')) {
                        this.logger.verbose('command init found');
                        const state = (_e = waInstance === null || waInstance === void 0 ? void 0 : waInstance.connectionStatus) === null || _e === void 0 ? void 0 : _e.state;
                        if (state !== 'open') {
                            this.logger.verbose('connect to whatsapp');
                            const number = command.split(':')[1];
                            yield waInstance.connectToWhatsapp(number);
                        }
                        else {
                            this.logger.verbose('whatsapp already connected');
                            yield this.createBotMessage(instance, `🚨 ${body.inbox.name} instance is connected.`, 'incoming');
                        }
                    }
                    if (command === 'status') {
                        this.logger.verbose('command status found');
                        const state = (_f = waInstance === null || waInstance === void 0 ? void 0 : waInstance.connectionStatus) === null || _f === void 0 ? void 0 : _f.state;
                        if (!state) {
                            this.logger.verbose('state not found');
                            yield this.createBotMessage(instance, `⚠️ ${body.inbox.name} instance not found.`, 'incoming');
                        }
                        if (state) {
                            this.logger.verbose('state: ' + state + ' found');
                            yield this.createBotMessage(instance, `⚠️ ${body.inbox.name} instance status: *${state}*`, 'incoming');
                        }
                    }
                    if (command === 'disconnect' || command === 'desconectar') {
                        this.logger.verbose('command disconnect found');
                        const msgLogout = `🚨 Disconnecting Whatsapp from inbox *${body.inbox.name}*: `;
                        this.logger.verbose('send message to chatwoot');
                        yield this.createBotMessage(instance, msgLogout, 'incoming');
                        this.logger.verbose('disconnect to whatsapp');
                        yield ((_g = waInstance === null || waInstance === void 0 ? void 0 : waInstance.client) === null || _g === void 0 ? void 0 : _g.logout('Log out instance: ' + instance.instanceName));
                        yield ((_j = (_h = waInstance === null || waInstance === void 0 ? void 0 : waInstance.client) === null || _h === void 0 ? void 0 : _h.ws) === null || _j === void 0 ? void 0 : _j.close());
                    }
                }
                if (body.message_type === 'outgoing' && ((_l = (_k = body === null || body === void 0 ? void 0 : body.conversation) === null || _k === void 0 ? void 0 : _k.messages) === null || _l === void 0 ? void 0 : _l.length) && chatId !== '123456') {
                    this.logger.verbose('check if is group');
                    this.messageCacheFile = path_1.default.join(path_config_1.ROOT_DIR, 'store', 'chatwoot', `${instance.instanceName}_cache.txt`);
                    this.logger.verbose('cache file path: ' + this.messageCacheFile);
                    this.messageCache = this.loadMessageCache();
                    this.logger.verbose('cache file loaded');
                    this.logger.verbose(this.messageCache);
                    this.logger.verbose('check if message is cached');
                    if (this.messageCache.has(body.id.toString())) {
                        this.logger.verbose('message is cached');
                        return { message: 'bot' };
                    }
                    this.logger.verbose('clear cache');
                    this.clearMessageCache();
                    this.logger.verbose('Format message to send');
                    let formatText;
                    if (senderName === null || senderName === undefined) {
                        formatText = messageReceived;
                    }
                    else {
                        formatText = this.provider.sign_msg ? `*${senderName}:*\n${messageReceived}` : messageReceived;
                    }
                    for (const message of body.conversation.messages) {
                        this.logger.verbose('check if message is media');
                        if (message.attachments && message.attachments.length > 0) {
                            this.logger.verbose('message is media');
                            for (const attachment of message.attachments) {
                                this.logger.verbose('send media to whatsapp');
                                if (!messageReceived) {
                                    this.logger.verbose('message do not have text');
                                    formatText = null;
                                }
                                yield this.sendAttachment(waInstance, chatId, attachment.data_url, formatText);
                            }
                        }
                        else {
                            this.logger.verbose('message is text');
                            this.logger.verbose('send text to whatsapp');
                            const data = {
                                number: chatId,
                                textMessage: {
                                    text: formatText,
                                },
                                options: {
                                    delay: 1200,
                                    presence: 'composing',
                                },
                            };
                            yield (waInstance === null || waInstance === void 0 ? void 0 : waInstance.textMessage(data));
                        }
                    }
                }
                if (body.message_type === 'template' && body.event === 'message_created') {
                    this.logger.verbose('check if is template');
                    const data = {
                        number: chatId,
                        textMessage: {
                            text: body.content.replace(/\\\r\n|\\\n|\n/g, '\n'),
                        },
                        options: {
                            delay: 1200,
                            presence: 'composing',
                        },
                    };
                    this.logger.verbose('send text to whatsapp');
                    yield (waInstance === null || waInstance === void 0 ? void 0 : waInstance.textMessage(data));
                }
                return { message: 'bot' };
            }
            catch (error) {
                this.logger.error(error);
                return { message: 'bot' };
            }
        });
    }
    isMediaMessage(message) {
        this.logger.verbose('check if is media message');
        const media = [
            'imageMessage',
            'documentMessage',
            'documentWithCaptionMessage',
            'audioMessage',
            'videoMessage',
            'stickerMessage',
        ];
        const messageKeys = Object.keys(message);
        const result = messageKeys.some((key) => media.includes(key));
        this.logger.verbose('is media message: ' + result);
        return result;
    }
    getTypeMessage(msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.logger.verbose('get type message');
        const types = {
            conversation: msg.conversation,
            imageMessage: (_a = msg.imageMessage) === null || _a === void 0 ? void 0 : _a.caption,
            videoMessage: (_b = msg.videoMessage) === null || _b === void 0 ? void 0 : _b.caption,
            extendedTextMessage: (_c = msg.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.text,
            messageContextInfo: (_d = msg.messageContextInfo) === null || _d === void 0 ? void 0 : _d.stanzaId,
            stickerMessage: undefined,
            documentMessage: (_e = msg.documentMessage) === null || _e === void 0 ? void 0 : _e.caption,
            documentWithCaptionMessage: (_h = (_g = (_f = msg.documentWithCaptionMessage) === null || _f === void 0 ? void 0 : _f.message) === null || _g === void 0 ? void 0 : _g.documentMessage) === null || _h === void 0 ? void 0 : _h.caption,
            audioMessage: (_j = msg.audioMessage) === null || _j === void 0 ? void 0 : _j.caption,
            contactMessage: (_k = msg.contactMessage) === null || _k === void 0 ? void 0 : _k.vcard,
            contactsArrayMessage: msg.contactsArrayMessage,
            locationMessage: msg.locationMessage,
            liveLocationMessage: msg.liveLocationMessage,
        };
        this.logger.verbose('type message: ' + types);
        return types;
    }
    getMessageContent(types) {
        this.logger.verbose('get message content');
        const typeKey = Object.keys(types).find((key) => types[key] !== undefined);
        const result = typeKey ? types[typeKey] : undefined;
        if (typeKey === 'locationMessage' || typeKey === 'liveLocationMessage') {
            const latitude = result.degreesLatitude;
            const longitude = result.degreesLongitude;
            const formattedLocation = `**Location:**
        **latitude:** ${latitude}
        **longitude:** ${longitude}
        https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}
        `;
            this.logger.verbose('message content: ' + formattedLocation);
            return formattedLocation;
        }
        if (typeKey === 'contactMessage') {
            const vCardData = result.split('\n');
            const contactInfo = {};
            vCardData.forEach((line) => {
                const [key, value] = line.split(':');
                if (key && value) {
                    contactInfo[key] = value;
                }
            });
            let formattedContact = `**Contact:**
        **name:** ${contactInfo['FN']}`;
            let numberCount = 1;
            Object.keys(contactInfo).forEach((key) => {
                if (key.startsWith('item') && key.includes('TEL')) {
                    const phoneNumber = contactInfo[key];
                    formattedContact += `\n**number ${numberCount}:** ${phoneNumber}`;
                    numberCount++;
                }
            });
            this.logger.verbose('message content: ' + formattedContact);
            return formattedContact;
        }
        if (typeKey === 'contactsArrayMessage') {
            const formattedContacts = result.contacts.map((contact) => {
                const vCardData = contact.vcard.split('\n');
                const contactInfo = {};
                vCardData.forEach((line) => {
                    const [key, value] = line.split(':');
                    if (key && value) {
                        contactInfo[key] = value;
                    }
                });
                let formattedContact = `**Contact:**
            **name:** ${contact.displayName}`;
                let numberCount = 1;
                Object.keys(contactInfo).forEach((key) => {
                    if (key.startsWith('item') && key.includes('TEL')) {
                        const phoneNumber = contactInfo[key];
                        formattedContact += `\n**number ${numberCount}:** ${phoneNumber}`;
                        numberCount++;
                    }
                });
                return formattedContact;
            });
            const formattedContactsArray = formattedContacts.join('\n\n');
            this.logger.verbose('formatted contacts: ' + formattedContactsArray);
            return formattedContactsArray;
        }
        this.logger.verbose('message content: ' + result);
        return result;
    }
    getConversationMessage(msg) {
        this.logger.verbose('get conversation message');
        const types = this.getTypeMessage(msg);
        const messageContent = this.getMessageContent(types);
        this.logger.verbose('conversation message: ' + messageContent);
        return messageContent;
    }
    eventWhatsapp(event, instance, body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('event whatsapp to instance: ' + instance.instanceName);
            try {
                const client = yield this.clientCw(instance);
                if (!client) {
                    this.logger.warn('client not found');
                    return null;
                }
                const waInstance = this.waMonitor.waInstances[instance.instanceName];
                if (!waInstance) {
                    this.logger.warn('wa instance not found');
                    return null;
                }
                if (event === 'messages.upsert') {
                    this.logger.verbose('event messages.upsert');
                    if (body.key.remoteJid === 'status@broadcast') {
                        this.logger.verbose('status broadcast found');
                        return;
                    }
                    this.logger.verbose('get conversation message');
                    const bodyMessage = yield this.getConversationMessage(body.message);
                    const isMedia = this.isMediaMessage(body.message);
                    if (!bodyMessage && !isMedia) {
                        this.logger.warn('no body message found');
                        return;
                    }
                    this.logger.verbose('get conversation in chatwoot');
                    const getConversion = yield this.createConversation(instance, body);
                    if (!getConversion) {
                        this.logger.warn('conversation not found');
                        return;
                    }
                    const messageType = body.key.fromMe ? 'outgoing' : 'incoming';
                    this.logger.verbose('message type: ' + messageType);
                    this.logger.verbose('is media: ' + isMedia);
                    this.logger.verbose('check if is media');
                    if (isMedia) {
                        this.logger.verbose('message is media');
                        this.logger.verbose('get base64 from media message');
                        const downloadBase64 = yield (waInstance === null || waInstance === void 0 ? void 0 : waInstance.getBase64FromMediaMessage({
                            message: Object.assign({}, body),
                        }));
                        const random = Math.random().toString(36).substring(7);
                        const nameFile = `${random}.${mime_types_1.default.extension(downloadBase64.mimetype)}`;
                        const fileData = Buffer.from(downloadBase64.base64, 'base64');
                        const fileName = `${path_1.default.join(waInstance === null || waInstance === void 0 ? void 0 : waInstance.storePath, 'temp', `${nameFile}`)}`;
                        this.logger.verbose('temp file name: ' + nameFile);
                        this.logger.verbose('create temp file');
                        (0, fs_1.writeFileSync)(fileName, fileData, 'utf8');
                        this.logger.verbose('check if is group');
                        if (body.key.remoteJid.includes('@g.us')) {
                            this.logger.verbose('message is group');
                            const participantName = body.pushName;
                            let content;
                            if (!body.key.fromMe) {
                                this.logger.verbose('message is not from me');
                                content = `**${participantName}:**\n\n${bodyMessage}`;
                            }
                            else {
                                this.logger.verbose('message is from me');
                                content = `${bodyMessage}`;
                            }
                            this.logger.verbose('send data to chatwoot');
                            const send = yield this.sendData(getConversion, fileName, messageType, content);
                            if (!send) {
                                this.logger.warn('message not sent');
                                return;
                            }
                            this.messageCacheFile = path_1.default.join(path_config_1.ROOT_DIR, 'store', 'chatwoot', `${instance.instanceName}_cache.txt`);
                            this.messageCache = this.loadMessageCache();
                            this.messageCache.add(send.id.toString());
                            this.logger.verbose('save message cache');
                            this.saveMessageCache();
                            return send;
                        }
                        else {
                            this.logger.verbose('message is not group');
                            this.logger.verbose('send data to chatwoot');
                            const send = yield this.sendData(getConversion, fileName, messageType, bodyMessage);
                            if (!send) {
                                this.logger.warn('message not sent');
                                return;
                            }
                            this.messageCacheFile = path_1.default.join(path_config_1.ROOT_DIR, 'store', 'chatwoot', `${instance.instanceName}_cache.txt`);
                            this.messageCache = this.loadMessageCache();
                            this.messageCache.add(send.id.toString());
                            this.logger.verbose('save message cache');
                            this.saveMessageCache();
                            return send;
                        }
                    }
                    this.logger.verbose('check if is group');
                    if (body.key.remoteJid.includes('@g.us')) {
                        this.logger.verbose('message is group');
                        const participantName = body.pushName;
                        let content;
                        if (!body.key.fromMe) {
                            this.logger.verbose('message is not from me');
                            content = `**${participantName}**\n\n${bodyMessage}`;
                        }
                        else {
                            this.logger.verbose('message is from me');
                            content = `${bodyMessage}`;
                        }
                        this.logger.verbose('send data to chatwoot');
                        const send = yield this.createMessage(instance, getConversion, content, messageType);
                        if (!send) {
                            this.logger.warn('message not sent');
                            return;
                        }
                        this.messageCacheFile = path_1.default.join(path_config_1.ROOT_DIR, 'store', 'chatwoot', `${instance.instanceName}_cache.txt`);
                        this.messageCache = this.loadMessageCache();
                        this.messageCache.add(send.id.toString());
                        this.logger.verbose('save message cache');
                        this.saveMessageCache();
                        return send;
                    }
                    else {
                        this.logger.verbose('message is not group');
                        this.logger.verbose('send data to chatwoot');
                        const send = yield this.createMessage(instance, getConversion, bodyMessage, messageType);
                        if (!send) {
                            this.logger.warn('message not sent');
                            return;
                        }
                        this.messageCacheFile = path_1.default.join(path_config_1.ROOT_DIR, 'store', 'chatwoot', `${instance.instanceName}_cache.txt`);
                        this.messageCache = this.loadMessageCache();
                        this.messageCache.add(send.id.toString());
                        this.logger.verbose('save message cache');
                        this.saveMessageCache();
                        return send;
                    }
                }
                if (event === 'status.instance') {
                    this.logger.verbose('event status.instance');
                    const data = body;
                    const inbox = yield this.getInbox(instance);
                    if (!inbox) {
                        this.logger.warn('inbox not found');
                        return;
                    }
                    const msgStatus = `⚡️ Instance status ${inbox.name}: ${data.status}`;
                    this.logger.verbose('send message to chatwoot');
                    yield this.createBotMessage(instance, msgStatus, 'incoming');
                }
                if (event === 'connection.update') {
                    this.logger.verbose('event connection.update');
                    if (body.status === 'open') {
                        const msgConnection = `🚀 Connection successfully established!`;
                        this.logger.verbose('send message to chatwoot');
                        yield this.createBotMessage(instance, msgConnection, 'incoming');
                    }
                }
                if (event === 'qrcode.updated') {
                    this.logger.verbose('event qrcode.updated');
                    if (body.statusCode === 500) {
                        this.logger.verbose('qrcode error');
                        const erroQRcode = `🚨 QRCode generation limit reached, to generate a new QRCode, send the 'init' message again.`;
                        this.logger.verbose('send message to chatwoot');
                        return yield this.createBotMessage(instance, erroQRcode, 'incoming');
                    }
                    else {
                        this.logger.verbose('qrcode success');
                        const fileData = Buffer.from(body === null || body === void 0 ? void 0 : body.qrcode.base64.replace('data:image/png;base64,', ''), 'base64');
                        const fileName = `${path_1.default.join(waInstance === null || waInstance === void 0 ? void 0 : waInstance.storePath, 'temp', `${`${instance}.png`}`)}`;
                        this.logger.verbose('temp file name: ' + fileName);
                        this.logger.verbose('create temp file');
                        (0, fs_1.writeFileSync)(fileName, fileData, 'utf8');
                        this.logger.verbose('send qrcode to chatwoot');
                        yield this.createBotQr(instance, 'QRCode successfully generated!', 'incoming', fileName);
                        let msgQrCode = `⚡️ QRCode successfully generated!\n\nScan this QR code within the next 40 seconds.`;
                        if ((_a = body === null || body === void 0 ? void 0 : body.qrcode) === null || _a === void 0 ? void 0 : _a.pairingCode) {
                            msgQrCode =
                                msgQrCode +
                                    `\n\n*Pairing Code:* ${body.qrcode.pairingCode.substring(0, 4)}-${body.qrcode.pairingCode.substring(4, 8)}`;
                        }
                        this.logger.verbose('send message to chatwoot');
                        yield this.createBotMessage(instance, msgQrCode, 'incoming');
                    }
                }
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
}
exports.ChatwootService = ChatwootService;
