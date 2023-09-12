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
exports.MessageUpRepository = exports.MessageUpQuery = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class MessageUpQuery {
}
exports.MessageUpQuery = MessageUpQuery;
class MessageUpRepository extends abstract_repository_1.Repository {
    constructor(messageUpModel, configService) {
        super(configService);
        this.messageUpModel = messageUpModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('MessageUpRepository');
    }
    insert(data, instanceName, saveDb) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('inserting message up');
            if (data.length === 0) {
                this.logger.verbose('no message up to insert');
                return;
            }
            try {
                if (this.dbSettings.ENABLED && saveDb) {
                    this.logger.verbose('saving message up to db');
                    const insert = yield this.messageUpModel.insertMany([...data]);
                    this.logger.verbose('message up saved to db: ' + insert.length + ' message up');
                    return { insertCount: insert.length };
                }
                this.logger.verbose('saving message up to store');
                const store = this.configService.get('STORE');
                if (store.MESSAGE_UP) {
                    this.logger.verbose('saving message up to store');
                    data.forEach((update) => {
                        this.writeStore({
                            path: (0, path_1.join)(this.storePath, 'message-up', instanceName),
                            fileName: update.id,
                            data: update,
                        });
                        this.logger.verbose('message up saved to store in path: ' + (0, path_1.join)(this.storePath, 'message-up', instanceName) + '/' + update.id);
                    });
                    this.logger.verbose('message up saved to store: ' + data.length + ' message up');
                    return { insertCount: data.length };
                }
                this.logger.verbose('message up not saved to store');
                return { insertCount: 0 };
            }
            catch (error) {
                return error;
            }
        });
    }
    find(query) {
        var _a, e_1, _b, _c;
        var _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('finding message up');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding message up in db');
                    return yield this.messageUpModel
                        .find(Object.assign({}, query.where))
                        .sort({ datetime: -1 })
                        .limit((_d = query === null || query === void 0 ? void 0 : query.limit) !== null && _d !== void 0 ? _d : 0);
                }
                this.logger.verbose('finding message up in store');
                const messageUpdate = [];
                if ((_e = query === null || query === void 0 ? void 0 : query.where) === null || _e === void 0 ? void 0 : _e.id) {
                    this.logger.verbose('finding message up in store by id');
                    messageUpdate.push(JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'message-up', query.where.owner, query.where.id + '.json'), {
                        encoding: 'utf-8',
                    })));
                }
                else {
                    this.logger.verbose('finding message up in store by owner');
                    const openDir = (0, fs_1.opendirSync)((0, path_1.join)(this.storePath, 'message-up', query.where.owner), {
                        encoding: 'utf-8',
                    });
                    try {
                        for (var _g = true, openDir_1 = __asyncValues(openDir), openDir_1_1; openDir_1_1 = yield openDir_1.next(), _a = openDir_1_1.done, !_a;) {
                            _c = openDir_1_1.value;
                            _g = false;
                            try {
                                const dirent = _c;
                                if (dirent.isFile()) {
                                    messageUpdate.push(JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'message-up', query.where.owner, dirent.name), {
                                        encoding: 'utf-8',
                                    })));
                                }
                            }
                            finally {
                                _g = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_g && !_a && (_b = openDir_1.return)) yield _b.call(openDir_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                this.logger.verbose('message up found in store: ' + messageUpdate.length + ' message up');
                return messageUpdate
                    .sort((x, y) => {
                    return y.datetime - x.datetime;
                })
                    .splice(0, (_f = query === null || query === void 0 ? void 0 : query.limit) !== null && _f !== void 0 ? _f : messageUpdate.length);
            }
            catch (error) {
                return [];
            }
        });
    }
}
exports.MessageUpRepository = MessageUpRepository;
