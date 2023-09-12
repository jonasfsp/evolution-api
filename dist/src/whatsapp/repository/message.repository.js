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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = exports.MessageQuery = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class MessageQuery {
}
exports.MessageQuery = MessageQuery;
class MessageRepository extends abstract_repository_1.Repository {
    constructor(messageModel, configService) {
        super(configService);
        this.messageModel = messageModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('MessageRepository');
    }
    insert(data, instanceName, saveDb = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('inserting messages');
            if (!Array.isArray(data) || data.length === 0) {
                this.logger.verbose('no messages to insert');
                return;
            }
            try {
                if (this.dbSettings.ENABLED && saveDb) {
                    this.logger.verbose('saving messages to db');
                    const cleanedData = data.map((obj) => {
                        var _a;
                        const cleanedObj = Object.assign({}, obj);
                        if ('extendedTextMessage' in obj.message) {
                            const extendedTextMessage = obj.message.extendedTextMessage;
                            if (typeof extendedTextMessage === 'object' && extendedTextMessage !== null) {
                                if ('contextInfo' in extendedTextMessage) {
                                    (_a = extendedTextMessage.contextInfo) === null || _a === void 0 ? true : delete _a.mentionedJid;
                                    extendedTextMessage.contextInfo = {};
                                }
                            }
                        }
                        return cleanedObj;
                    });
                    const insert = yield this.messageModel.insertMany([...cleanedData]);
                    this.logger.verbose('messages saved to db: ' + insert.length + ' messages');
                    return { insertCount: insert.length };
                }
                this.logger.verbose('saving messages to store');
                const store = this.configService.get('STORE');
                if (store.MESSAGES) {
                    this.logger.verbose('saving messages to store');
                    data.forEach((message) => {
                        this.writeStore({
                            path: (0, path_1.join)(this.storePath, 'messages', instanceName),
                            fileName: message.key.id,
                            data: message,
                        });
                        this.logger.verbose('messages saved to store in path: ' + (0, path_1.join)(this.storePath, 'messages', instanceName) + '/' + message.key.id);
                    });
                    this.logger.verbose('messages saved to store: ' + data.length + ' messages');
                    return { insertCount: data.length };
                }
                this.logger.verbose('messages not saved to store');
                return { insertCount: 0 };
            }
            catch (error) {
                console.log('ERROR: ', error);
                return error;
            }
            finally {
                data = undefined;
            }
        });
    }
    find(query) {
        var _a, e_1, _b, _c;
        var _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('finding messages');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding messages in db');
                    if ((_d = query === null || query === void 0 ? void 0 : query.where) === null || _d === void 0 ? void 0 : _d.key) {
                        for (const [k, v] of Object.entries(query.where.key)) {
                            query.where['key.' + k] = v;
                        }
                        (_e = query === null || query === void 0 ? void 0 : query.where) === null || _e === void 0 ? true : delete _e.key;
                    }
                    return yield this.messageModel
                        .find(Object.assign({}, query.where))
                        .sort({ messageTimestamp: -1 })
                        .limit((_f = query === null || query === void 0 ? void 0 : query.limit) !== null && _f !== void 0 ? _f : 0);
                }
                this.logger.verbose('finding messages in store');
                const messages = [];
                if ((_h = (_g = query === null || query === void 0 ? void 0 : query.where) === null || _g === void 0 ? void 0 : _g.key) === null || _h === void 0 ? void 0 : _h.id) {
                    this.logger.verbose('finding messages in store by id');
                    messages.push(JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'messages', query.where.owner, query.where.key.id + '.json'), {
                        encoding: 'utf-8',
                    })));
                }
                else {
                    this.logger.verbose('finding messages in store by owner');
                    const openDir = (0, fs_1.opendirSync)((0, path_1.join)(this.storePath, 'messages', query.where.owner), {
                        encoding: 'utf-8',
                    });
                    try {
                        for (var _k = true, openDir_1 = __asyncValues(openDir), openDir_1_1; openDir_1_1 = yield openDir_1.next(), _a = openDir_1_1.done, !_a;) {
                            _c = openDir_1_1.value;
                            _k = false;
                            try {
                                const dirent = _c;
                                if (dirent.isFile()) {
                                    messages.push(JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'messages', query.where.owner, dirent.name), {
                                        encoding: 'utf-8',
                                    })));
                                }
                            }
                            finally {
                                _k = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_k && !_a && (_b = openDir_1.return)) yield _b.call(openDir_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                this.logger.verbose('messages found in store: ' + messages.length + ' messages');
                return messages
                    .sort((x, y) => {
                    return y.messageTimestamp - x.messageTimestamp;
                })
                    .splice(0, (_j = query === null || query === void 0 ? void 0 : query.limit) !== null && _j !== void 0 ? _j : messages.length);
            }
            catch (error) {
                return [];
            }
        });
    }
}
exports.MessageRepository = MessageRepository;
