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
exports.WAMonitoringService = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const path_config_1 = require("../../config/path.config");
const exceptions_1 = require("../../exceptions");
const db_connect_1 = require("../../libs/db.connect");
const models_1 = require("../models");
const whatsapp_service_1 = require("./whatsapp.service");
class WAMonitoringService {
    constructor(eventEmitter, configService, repository, cache) {
        var _a;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
        this.repository = repository;
        this.cache = cache;
        this.db = {};
        this.redis = {};
        this.dbStore = db_connect_1.dbserver;
        this.logger = new logger_config_1.Logger(WAMonitoringService.name);
        this.waInstances = {};
        this.logger.verbose('instance created');
        this.removeInstance();
        this.noConnection();
        this.delInstanceFiles();
        Object.assign(this.db, configService.get('DATABASE'));
        Object.assign(this.redis, configService.get('REDIS'));
        this.dbInstance = this.db.ENABLED
            ? (_a = this.repository.dbServer) === null || _a === void 0 ? void 0 : _a.db(this.db.CONNECTION.DB_PREFIX_NAME + '-instances')
            : undefined;
    }
    delInstanceTime(instance) {
        const time = this.configService.get('DEL_INSTANCE');
        if (typeof time === 'number' && time > 0) {
            this.logger.verbose(`Instance "${instance}" don't have connection, will be removed in ${time} minutes`);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                if (((_b = (_a = this.waInstances[instance]) === null || _a === void 0 ? void 0 : _a.connectionStatus) === null || _b === void 0 ? void 0 : _b.state) !== 'open') {
                    if (((_d = (_c = this.waInstances[instance]) === null || _c === void 0 ? void 0 : _c.connectionStatus) === null || _d === void 0 ? void 0 : _d.state) === 'connecting') {
                        yield ((_f = (_e = this.waInstances[instance]) === null || _e === void 0 ? void 0 : _e.client) === null || _f === void 0 ? void 0 : _f.logout('Log out instance: ' + instance));
                        (_j = (_h = (_g = this.waInstances[instance]) === null || _g === void 0 ? void 0 : _g.client) === null || _h === void 0 ? void 0 : _h.ws) === null || _j === void 0 ? void 0 : _j.close();
                        (_l = (_k = this.waInstances[instance]) === null || _k === void 0 ? void 0 : _k.client) === null || _l === void 0 ? void 0 : _l.end(undefined);
                        delete this.waInstances[instance];
                    }
                    else {
                        delete this.waInstances[instance];
                        this.eventEmitter.emit('remove.instance', instance, 'inner');
                    }
                }
            }), 1000 * 60 * time);
        }
    }
    instanceInfo(instanceName) {
        var _a, e_1, _b, _c;
        var _d;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('get instance info');
            if (instanceName && !this.waInstances[instanceName]) {
                throw new exceptions_1.NotFoundException(`Instance "${instanceName}" not found`);
            }
            const instances = [];
            try {
                for (var _e = true, _f = __asyncValues(Object.entries(this.waInstances)), _g; _g = yield _f.next(), _a = _g.done, !_a;) {
                    _c = _g.value;
                    _e = false;
                    try {
                        const [key, value] = _c;
                        if (value) {
                            this.logger.verbose('get instance info: ' + key);
                            let chatwoot;
                            const urlServer = this.configService.get('SERVER').URL;
                            const findChatwoot = yield this.waInstances[key].findChatwoot();
                            if (findChatwoot && findChatwoot.enabled) {
                                chatwoot = Object.assign(Object.assign({}, findChatwoot), { webhook_url: `${urlServer}/chatwoot/webhook/${encodeURIComponent(key)}` });
                            }
                            if (value.connectionStatus.state === 'open') {
                                this.logger.verbose('instance: ' + key + ' - connectionStatus: open');
                                const instanceData = {
                                    instance: {
                                        instanceName: key,
                                        owner: value.wuid,
                                        profileName: (yield value.getProfileName()) || 'not loaded',
                                        profilePictureUrl: value.profilePictureUrl,
                                        profileStatus: (yield value.getProfileStatus()) || '',
                                        status: value.connectionStatus.state,
                                    },
                                };
                                if (this.configService.get('AUTHENTICATION').EXPOSE_IN_FETCH_INSTANCES) {
                                    instanceData.instance['serverUrl'] = this.configService.get('SERVER').URL;
                                    instanceData.instance['apikey'] = (yield this.repository.auth.find(key)).apikey;
                                    instanceData.instance['chatwoot'] = chatwoot;
                                }
                                instances.push(instanceData);
                            }
                            else {
                                this.logger.verbose('instance: ' + key + ' - connectionStatus: ' + value.connectionStatus.state);
                                const instanceData = {
                                    instance: {
                                        instanceName: key,
                                        status: value.connectionStatus.state,
                                    },
                                };
                                if (this.configService.get('AUTHENTICATION').EXPOSE_IN_FETCH_INSTANCES) {
                                    instanceData.instance['serverUrl'] = this.configService.get('SERVER').URL;
                                    instanceData.instance['apikey'] = (yield this.repository.auth.find(key)).apikey;
                                    instanceData.instance['chatwoot'] = chatwoot;
                                }
                                instances.push(instanceData);
                            }
                        }
                    }
                    finally {
                        _e = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.logger.verbose('return instance info: ' + instances.length);
            return (_d = instances.find((i) => i.instance.instanceName === instanceName)) !== null && _d !== void 0 ? _d : instances;
        });
    }
    delInstanceFiles() {
        this.logger.verbose('cron to delete instance files started');
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            if (this.db.ENABLED && this.db.SAVE_DATA.INSTANCE) {
                const collections = yield this.dbInstance.collections();
                collections.forEach((collection) => __awaiter(this, void 0, void 0, function* () {
                    const name = collection.namespace.replace(/^[\w-]+./, '');
                    yield this.dbInstance.collection(name).deleteMany({
                        $or: [{ _id: { $regex: /^app.state.*/ } }, { _id: { $regex: /^session-.*/ } }],
                    });
                    this.logger.verbose('instance files deleted: ' + name);
                }));
            }
            else {
                const dir = (0, fs_1.opendirSync)(path_config_1.INSTANCE_DIR, { encoding: 'utf-8' });
                try {
                    for (var _d = true, dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), _a = dir_1_1.done, !_a;) {
                        _c = dir_1_1.value;
                        _d = false;
                        try {
                            const dirent = _c;
                            if (dirent.isDirectory()) {
                                const files = (0, fs_1.readdirSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, dirent.name), {
                                    encoding: 'utf-8',
                                });
                                files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                                    if (file.match(/^app.state.*/) || file.match(/^session-.*/)) {
                                        (0, fs_1.rmSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, dirent.name, file), {
                                            recursive: true,
                                            force: true,
                                        });
                                    }
                                }));
                                this.logger.verbose('instance files deleted: ' + dirent.name);
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = dir_1.return)) yield _b.call(dir_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }), 3600 * 1000 * 2);
    }
    cleaningUp(instanceName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('cleaning up instance: ' + instanceName);
            if (this.db.ENABLED && this.db.SAVE_DATA.INSTANCE) {
                this.logger.verbose('cleaning up instance in database: ' + instanceName);
                yield this.repository.dbServer.connect();
                const collections = yield this.dbInstance.collections();
                if (collections.length > 0) {
                    yield this.dbInstance.dropCollection(instanceName);
                }
                return;
            }
            if (this.redis.ENABLED) {
                this.logger.verbose('cleaning up instance in redis: ' + instanceName);
                this.cache.reference = instanceName;
                yield this.cache.delAll();
                return;
            }
            this.logger.verbose('cleaning up instance in files: ' + instanceName);
            (0, fs_1.rmSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, instanceName), { recursive: true, force: true });
        });
    }
    cleaningStoreFiles(instanceName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db.ENABLED) {
                this.logger.verbose('cleaning store files instance: ' + instanceName);
                (0, fs_1.rmSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, instanceName), { recursive: true, force: true });
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'chats', instanceName)}`);
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'contacts', instanceName)}`);
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'message-up', instanceName)}`);
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'messages', instanceName)}`);
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'auth', 'apikey', instanceName + '.json')}`);
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'webhook', instanceName + '.json')}`);
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'chatwoot', instanceName + '*')}`);
                (0, child_process_1.execSync)(`rm -rf ${(0, path_1.join)(path_config_1.STORE_DIR, 'settings', instanceName + '*')}`);
                return;
            }
            this.logger.verbose('cleaning store database instance: ' + instanceName);
            yield models_1.AuthModel.deleteMany({ owner: instanceName });
            yield models_1.ContactModel.deleteMany({ owner: instanceName });
            yield models_1.MessageModel.deleteMany({ owner: instanceName });
            yield models_1.MessageUpModel.deleteMany({ owner: instanceName });
            yield models_1.AuthModel.deleteMany({ _id: instanceName });
            yield models_1.WebhookModel.deleteMany({ _id: instanceName });
            yield models_1.ChatwootModel.deleteMany({ _id: instanceName });
            yield models_1.SettingsModel.deleteMany({ _id: instanceName });
            return;
        });
    }
    loadInstance() {
        var _a, e_3, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('load instances');
            const set = (name) => __awaiter(this, void 0, void 0, function* () {
                const instance = new whatsapp_service_1.WAStartupService(this.configService, this.eventEmitter, this.repository, this.cache);
                instance.instanceName = name;
                this.logger.verbose('instance loaded: ' + name);
                yield instance.connectToWhatsapp();
                this.logger.verbose('connectToWhatsapp: ' + name);
                this.waInstances[name] = instance;
            });
            try {
                if (this.redis.ENABLED) {
                    this.logger.verbose('redis enabled');
                    yield this.cache.connect(this.redis);
                    const keys = yield this.cache.instanceKeys();
                    if ((keys === null || keys === void 0 ? void 0 : keys.length) > 0) {
                        this.logger.verbose('reading instance keys and setting instances');
                        keys.forEach((k) => __awaiter(this, void 0, void 0, function* () { return yield set(k.split(':')[1]); }));
                    }
                    else {
                        this.logger.verbose('no instance keys found');
                    }
                    return;
                }
                if (this.db.ENABLED && this.db.SAVE_DATA.INSTANCE) {
                    this.logger.verbose('database enabled');
                    yield this.repository.dbServer.connect();
                    const collections = yield this.dbInstance.collections();
                    if (collections.length > 0) {
                        this.logger.verbose('reading collections and setting instances');
                        collections.forEach((coll) => __awaiter(this, void 0, void 0, function* () { return yield set(coll.namespace.replace(/^[\w-]+\./, '')); }));
                    }
                    else {
                        this.logger.verbose('no collections found');
                    }
                    return;
                }
                this.logger.verbose('store in files enabled');
                const dir = (0, fs_1.opendirSync)(path_config_1.INSTANCE_DIR, { encoding: 'utf-8' });
                try {
                    for (var _d = true, dir_2 = __asyncValues(dir), dir_2_1; dir_2_1 = yield dir_2.next(), _a = dir_2_1.done, !_a;) {
                        _c = dir_2_1.value;
                        _d = false;
                        try {
                            const dirent = _c;
                            if (dirent.isDirectory()) {
                                this.logger.verbose('reading instance files and setting instances');
                                const files = (0, fs_1.readdirSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, dirent.name), {
                                    encoding: 'utf-8',
                                });
                                if (files.length === 0) {
                                    (0, fs_1.rmSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, dirent.name), { recursive: true, force: true });
                                    break;
                                }
                                yield set(dirent.name);
                            }
                            else {
                                this.logger.verbose('no instance files found');
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = dir_2.return)) yield _b.call(dir_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    removeInstance() {
        this.eventEmitter.on('remove.instance', (instanceName) => __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('remove instance: ' + instanceName);
            try {
                this.logger.verbose('instance: ' + instanceName + ' - removing from memory');
                this.waInstances[instanceName] = undefined;
            }
            catch (error) {
                this.logger.error(error);
            }
            try {
                this.logger.verbose('request cleaning up instance: ' + instanceName);
                this.cleaningUp(instanceName);
                this.cleaningStoreFiles(instanceName);
            }
            finally {
                this.logger.warn(`Instance "${instanceName}" - REMOVED`);
            }
        }));
        this.eventEmitter.on('logout.instance', (instanceName) => __awaiter(this, void 0, void 0, function* () {
            this.logger.verbose('logout instance: ' + instanceName);
            try {
                this.logger.verbose('request cleaning up instance: ' + instanceName);
                this.cleaningUp(instanceName);
            }
            finally {
                this.logger.warn(`Instance "${instanceName}" - LOGOUT`);
            }
        }));
    }
    noConnection() {
        this.logger.verbose('checking instances without connection');
        this.eventEmitter.on('no.connection', (instanceName) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                this.logger.verbose('logging out instance: ' + instanceName);
                yield ((_b = (_a = this.waInstances[instanceName]) === null || _a === void 0 ? void 0 : _a.client) === null || _b === void 0 ? void 0 : _b.logout('Log out instance: ' + instanceName));
                this.logger.verbose('close connection instance: ' + instanceName);
                (_e = (_d = (_c = this.waInstances[instanceName]) === null || _c === void 0 ? void 0 : _c.client) === null || _d === void 0 ? void 0 : _d.ws) === null || _e === void 0 ? void 0 : _e.close();
                this.waInstances[instanceName].instance.qrcode = { count: 0 };
                this.waInstances[instanceName].stateConnection.state = 'close';
            }
            catch (error) {
                this.logger.error({
                    localError: 'noConnection',
                    warn: 'Error deleting instance from memory.',
                    error,
                });
            }
            finally {
                this.logger.warn(`Instance "${instanceName}" - NOT CONNECTION`);
            }
        }));
    }
}
exports.WAMonitoringService = WAMonitoringService;
