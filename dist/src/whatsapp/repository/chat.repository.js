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
exports.ChatRepository = exports.ChatQuery = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class ChatQuery {
}
exports.ChatQuery = ChatQuery;
class ChatRepository extends abstract_repository_1.Repository {
    constructor(chatModel, configService) {
        super(configService);
        this.chatModel = chatModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('ChatRepository');
    }
    insert(data, instanceName, saveDb = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('inserting chats');
            if (data.length === 0) {
                this.logger.verbose('no chats to insert');
                return;
            }
            try {
                this.logger.verbose('saving chats to store');
                if (this.dbSettings.ENABLED && saveDb) {
                    this.logger.verbose('saving chats to db');
                    const insert = yield this.chatModel.insertMany([...data]);
                    this.logger.verbose('chats saved to db: ' + insert.length + ' chats');
                    return { insertCount: insert.length };
                }
                this.logger.verbose('saving chats to store');
                const store = this.configService.get('STORE');
                if (store.CHATS) {
                    this.logger.verbose('saving chats to store');
                    data.forEach((chat) => {
                        this.writeStore({
                            path: (0, path_1.join)(this.storePath, 'chats', instanceName),
                            fileName: chat.id,
                            data: chat,
                        });
                        this.logger.verbose('chats saved to store in path: ' + (0, path_1.join)(this.storePath, 'chats', instanceName) + '/' + chat.id);
                    });
                    this.logger.verbose('chats saved to store');
                    return { insertCount: data.length };
                }
                this.logger.verbose('chats not saved to store');
                return { insertCount: 0 };
            }
            catch (error) {
                return error;
            }
            finally {
                data = undefined;
            }
        });
    }
    find(query) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('finding chats');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding chats in db');
                    return yield this.chatModel.find({ owner: query.where.owner });
                }
                this.logger.verbose('finding chats in store');
                const chats = [];
                const openDir = (0, fs_1.opendirSync)((0, path_1.join)(this.storePath, 'chats', query.where.owner));
                try {
                    for (var _d = true, openDir_1 = __asyncValues(openDir), openDir_1_1; openDir_1_1 = yield openDir_1.next(), _a = openDir_1_1.done, !_a;) {
                        _c = openDir_1_1.value;
                        _d = false;
                        try {
                            const dirent = _c;
                            if (dirent.isFile()) {
                                chats.push(JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'chats', query.where.owner, dirent.name), {
                                    encoding: 'utf-8',
                                })));
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = openDir_1.return)) yield _b.call(openDir_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                this.logger.verbose('chats found in store: ' + chats.length + ' chats');
                return chats;
            }
            catch (error) {
                return [];
            }
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('deleting chats');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('deleting chats in db');
                    return yield this.chatModel.deleteOne(Object.assign({}, query.where));
                }
                this.logger.verbose('deleting chats in store');
                (0, fs_1.rmSync)((0, path_1.join)(this.storePath, 'chats', query.where.owner, query.where.id + '.josn'), {
                    force: true,
                    recursive: true,
                });
                return { deleted: { chatId: query.where.id } };
            }
            catch (error) {
                return { error: error === null || error === void 0 ? void 0 : error.toString() };
            }
        });
    }
}
exports.ChatRepository = ChatRepository;
