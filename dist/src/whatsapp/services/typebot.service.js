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
exports.TypebotService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_config_1 = require("../../config/logger.config");
class TypebotService {
    constructor(waMonitor) {
        this.waMonitor = waMonitor;
        this.logger = new logger_config_1.Logger(TypebotService.name);
    }
    create(instance, data) {
        this.logger.verbose('create typebot: ' + instance.instanceName);
        this.waMonitor.waInstances[instance.instanceName].setTypebot(data);
        return { typebot: Object.assign(Object.assign({}, instance), { typebot: data }) };
    }
    find(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('find typebot: ' + instance.instanceName);
                const result = yield this.waMonitor.waInstances[instance.instanceName].findTypebot();
                if (Object.keys(result).length === 0) {
                    throw new Error('Typebot not found');
                }
                return result;
            }
            catch (error) {
                return { enabled: false, url: '', typebot: '', expire: 0, sessions: [] };
            }
        });
    }
    changeStatus(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const remoteJid = data.remoteJid;
            const status = data.status;
            const findData = yield this.find(instance);
            const session = findData.sessions.find((session) => session.remoteJid === remoteJid);
            if (session) {
                if (status === 'closed') {
                    findData.sessions.splice(findData.sessions.indexOf(session), 1);
                    const typebotData = {
                        enabled: true,
                        url: findData.url,
                        typebot: findData.typebot,
                        expire: findData.expire,
                        keyword_finish: findData.keyword_finish,
                        delay_message: findData.delay_message,
                        unknown_message: findData.unknown_message,
                        sessions: findData.sessions,
                    };
                    this.create(instance, typebotData);
                    return { typebot: Object.assign(Object.assign({}, instance), { typebot: typebotData }) };
                }
                findData.sessions.map((session) => {
                    if (session.remoteJid === remoteJid) {
                        session.status = status;
                    }
                });
            }
            const typebotData = {
                enabled: true,
                url: findData.url,
                typebot: findData.typebot,
                expire: findData.expire,
                keyword_finish: findData.keyword_finish,
                delay_message: findData.delay_message,
                unknown_message: findData.unknown_message,
                sessions: findData.sessions,
            };
            this.create(instance, typebotData);
            return { typebot: Object.assign(Object.assign({}, instance), { typebot: typebotData }) };
        });
    }
    startTypebot(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const remoteJid = data.remoteJid;
            const url = data.url;
            const typebot = data.typebot;
            const id = Math.floor(Math.random() * 10000000000).toString();
            const reqData = {
                sessionId: id,
                startParams: {
                    typebot: data.typebot,
                    prefilledVariables: {
                        remoteJid: data.remoteJid,
                        pushName: data.pushName,
                        instanceName: instance.instanceName,
                    },
                },
            };
            console.log(reqData);
            const request = yield axios_1.default.post(data.url + '/api/v1/sendMessage', reqData);
            yield this.sendWAMessage(instance, remoteJid, request.data.messages, request.data.input, request.data.clientSideActions);
            return {
                typebot: Object.assign(Object.assign({}, instance), { typebot: {
                        url: url,
                        remoteJid: remoteJid,
                        typebot: typebot,
                    } }),
            };
        });
    }
    getTypeMessage(msg) {
        var _a;
        this.logger.verbose('get type message');
        const types = {
            conversation: msg.conversation,
            extendedTextMessage: (_a = msg.extendedTextMessage) === null || _a === void 0 ? void 0 : _a.text,
        };
        this.logger.verbose('type message: ' + types);
        return types;
    }
    getMessageContent(types) {
        this.logger.verbose('get message content');
        const typeKey = Object.keys(types).find((key) => types[key] !== undefined);
        const result = typeKey ? types[typeKey] : undefined;
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
    createNewSession(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Math.floor(Math.random() * 10000000000).toString();
            const reqData = {
                sessionId: id,
                startParams: {
                    typebot: data.typebot,
                    prefilledVariables: {
                        remoteJid: data.remoteJid,
                        pushName: data.pushName,
                        instanceName: instance.instanceName,
                    },
                },
            };
            const request = yield axios_1.default.post(data.url + '/api/v1/sendMessage', reqData);
            if (request.data.sessionId) {
                data.sessions.push({
                    remoteJid: data.remoteJid,
                    sessionId: `${id}-${request.data.sessionId}`,
                    status: 'opened',
                    createdAt: Date.now(),
                    updateAt: Date.now(),
                });
                const typebotData = {
                    enabled: true,
                    url: data.url,
                    typebot: data.typebot,
                    expire: data.expire,
                    keyword_finish: data.keyword_finish,
                    delay_message: data.delay_message,
                    unknown_message: data.unknown_message,
                    sessions: data.sessions,
                };
                this.create(instance, typebotData);
            }
            return request.data;
        });
    }
    sendWAMessage(instance, remoteJid, messages, input, clientSideActions) {
        return __awaiter(this, void 0, void 0, function* () {
            processMessages(this.waMonitor.waInstances[instance.instanceName], messages, input, clientSideActions).catch((err) => {
                console.error('Erro ao processar mensagens:', err);
            });
            function findItemAndGetSecondsToWait(array, targetId) {
                var _a;
                if (!array)
                    return null;
                for (const item of array) {
                    if (item.lastBubbleBlockId === targetId) {
                        return (_a = item.wait) === null || _a === void 0 ? void 0 : _a.secondsToWaitFor;
                    }
                }
                return null;
            }
            function processMessages(instance, messages, input, clientSideActions) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const message of messages) {
                        const wait = findItemAndGetSecondsToWait(clientSideActions, message.id);
                        if (message.type === 'text') {
                            let formattedText = '';
                            let linkPreview = false;
                            for (const richText of message.content.richText) {
                                for (const element of richText.children) {
                                    let text = '';
                                    if (element.text) {
                                        text = element.text;
                                    }
                                    if (element.bold) {
                                        text = `*${text}*`;
                                    }
                                    if (element.italic) {
                                        text = `_${text}_`;
                                    }
                                    if (element.underline) {
                                        text = `~${text}~`;
                                    }
                                    if (element.url) {
                                        const linkText = element.children[0].text;
                                        text = `[${linkText}](${element.url})`;
                                        linkPreview = true;
                                    }
                                    formattedText += text;
                                }
                                formattedText += '\n';
                            }
                            formattedText = formattedText.replace(/\n$/, '');
                            yield instance.textMessage({
                                number: remoteJid.split('@')[0],
                                options: {
                                    delay: wait ? wait * 1000 : instance.localTypebot.delay_message || 1000,
                                    presence: 'composing',
                                    linkPreview: linkPreview,
                                },
                                textMessage: {
                                    text: formattedText,
                                },
                            });
                        }
                        if (message.type === 'image') {
                            yield instance.mediaMessage({
                                number: remoteJid.split('@')[0],
                                options: {
                                    delay: wait ? wait * 1000 : instance.localTypebot.delay_message || 1000,
                                    presence: 'composing',
                                },
                                mediaMessage: {
                                    mediatype: 'image',
                                    media: message.content.url,
                                },
                            });
                        }
                        if (message.type === 'video') {
                            yield instance.mediaMessage({
                                number: remoteJid.split('@')[0],
                                options: {
                                    delay: wait ? wait * 1000 : instance.localTypebot.delay_message || 1000,
                                    presence: 'composing',
                                },
                                mediaMessage: {
                                    mediatype: 'video',
                                    media: message.content.url,
                                },
                            });
                        }
                        if (message.type === 'audio') {
                            yield instance.audioWhatsapp({
                                number: remoteJid.split('@')[0],
                                options: {
                                    delay: wait ? wait * 1000 : instance.localTypebot.delay_message || 1000,
                                    presence: 'recording',
                                    encoding: true,
                                },
                                audioMessage: {
                                    audio: message.content.url,
                                },
                            });
                        }
                    }
                    if (input) {
                        if (input.type === 'choice input') {
                            let formattedText = '';
                            const items = input.items;
                            for (const item of items) {
                                formattedText += `▶️ ${item.content}\n`;
                            }
                            formattedText = formattedText.replace(/\n$/, '');
                            yield instance.textMessage({
                                number: remoteJid.split('@')[0],
                                options: {
                                    delay: 1200,
                                    presence: 'composing',
                                    linkPreview: false,
                                },
                                textMessage: {
                                    text: formattedText,
                                },
                            });
                        }
                    }
                });
            }
        });
    }
    sendTypebot(instance, remoteJid, msg) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = (yield this.find(instance)).url;
            const typebot = (yield this.find(instance)).typebot;
            const sessions = (_a = (yield this.find(instance)).sessions) !== null && _a !== void 0 ? _a : [];
            const expire = (yield this.find(instance)).expire;
            const keyword_finish = (yield this.find(instance)).keyword_finish;
            const delay_message = (yield this.find(instance)).delay_message;
            const unknown_message = (yield this.find(instance)).unknown_message;
            const session = sessions.find((session) => session.remoteJid === remoteJid);
            if (session && expire && expire > 0) {
                const now = Date.now();
                const diff = now - session.updateAt;
                const diffInMinutes = Math.floor(diff / 1000 / 60);
                if (diffInMinutes > expire) {
                    sessions.splice(sessions.indexOf(session), 1);
                    const data = yield this.createNewSession(instance, {
                        url: url,
                        typebot: typebot,
                        expire: expire,
                        keyword_finish: keyword_finish,
                        delay_message: delay_message,
                        unknown_message: unknown_message,
                        sessions: sessions,
                        remoteJid: remoteJid,
                        pushName: msg.pushName,
                    });
                    yield this.sendWAMessage(instance, remoteJid, data.messages, data.input, data.clientSideActions);
                    return;
                }
            }
            if (session && session.status !== 'opened') {
                return;
            }
            if (!session) {
                const data = yield this.createNewSession(instance, {
                    url: url,
                    typebot: typebot,
                    expire: expire,
                    keyword_finish: keyword_finish,
                    delay_message: delay_message,
                    unknown_message: unknown_message,
                    sessions: sessions,
                    remoteJid: remoteJid,
                    pushName: msg.pushName,
                });
                yield this.sendWAMessage(instance, remoteJid, data.messages, data.input, data.clientSideActions);
                return;
            }
            sessions.map((session) => {
                if (session.remoteJid === remoteJid) {
                    session.updateAt = Date.now();
                }
            });
            const typebotData = {
                enabled: true,
                url: url,
                typebot: typebot,
                expire: expire,
                keyword_finish: keyword_finish,
                delay_message: delay_message,
                unknown_message: unknown_message,
                sessions,
            };
            this.create(instance, typebotData);
            const content = this.getConversationMessage(msg.message);
            if (!content) {
                if (unknown_message) {
                    this.waMonitor.waInstances[instance.instanceName].textMessage({
                        number: remoteJid.split('@')[0],
                        options: {
                            delay: delay_message || 1000,
                            presence: 'composing',
                        },
                        textMessage: {
                            text: unknown_message,
                        },
                    });
                }
                return;
            }
            if (content.toLowerCase() === keyword_finish.toLowerCase()) {
                sessions.splice(sessions.indexOf(session), 1);
                const typebotData = {
                    enabled: true,
                    url: url,
                    typebot: typebot,
                    expire: expire,
                    keyword_finish: keyword_finish,
                    delay_message: delay_message,
                    unknown_message: unknown_message,
                    sessions,
                };
                this.create(instance, typebotData);
                return;
            }
            const reqData = {
                message: content,
                sessionId: session.sessionId.split('-')[1],
            };
            const request = yield axios_1.default.post(url + '/api/v1/sendMessage', reqData);
            yield this.sendWAMessage(instance, remoteJid, request.data.messages, request.data.input, request.data.clientSideActions);
            return;
        });
    }
}
exports.TypebotService = TypebotService;
