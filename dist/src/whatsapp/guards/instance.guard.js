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
exports.instanceLoggedGuard = exports.instanceExistsGuard = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const env_config_1 = require("../../config/env.config");
const path_config_1 = require("../../config/path.config");
const exceptions_1 = require("../../exceptions");
const db_connect_1 = require("../../libs/db.connect");
const whatsapp_module_1 = require("../whatsapp.module");
function getInstance(instanceName) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = env_config_1.configService.get('DATABASE');
        const redisConf = env_config_1.configService.get('REDIS');
        const exists = !!whatsapp_module_1.waMonitor.waInstances[instanceName];
        if (redisConf.ENABLED) {
            const keyExists = yield whatsapp_module_1.cache.keyExists();
            return exists || keyExists;
        }
        if (db.ENABLED) {
            const collection = db_connect_1.dbserver
                .getClient()
                .db(db.CONNECTION.DB_PREFIX_NAME + '-instances')
                .collection(instanceName);
            return exists || (yield collection.find({}).toArray()).length > 0;
        }
        return exists || (0, fs_1.existsSync)((0, path_1.join)(path_config_1.INSTANCE_DIR, instanceName));
    });
}
function instanceExistsGuard(req, _, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.originalUrl.includes('/instance/create') || req.originalUrl.includes('/instance/fetchInstances')) {
            return next();
        }
        const param = req.params;
        if (!(param === null || param === void 0 ? void 0 : param.instanceName)) {
            throw new exceptions_1.BadRequestException('"instanceName" not provided.');
        }
        if (!(yield getInstance(param.instanceName))) {
            throw new exceptions_1.NotFoundException(`The "${param.instanceName}" instance does not exist`);
        }
        next();
    });
}
exports.instanceExistsGuard = instanceExistsGuard;
function instanceLoggedGuard(req, _, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.originalUrl.includes('/instance/create')) {
            const instance = req.body;
            if (yield getInstance(instance.instanceName)) {
                throw new exceptions_1.ForbiddenException(`This name "${instance.instanceName}" is already in use.`);
            }
            if (whatsapp_module_1.waMonitor.waInstances[instance.instanceName]) {
                delete whatsapp_module_1.waMonitor.waInstances[instance.instanceName];
            }
        }
        next();
    });
}
exports.instanceLoggedGuard = instanceLoggedGuard;
