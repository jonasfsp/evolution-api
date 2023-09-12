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
exports.ProxyRepository = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class ProxyRepository extends abstract_repository_1.Repository {
    constructor(proxyModel, configService) {
        super(configService);
        this.proxyModel = proxyModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('ProxyRepository');
    }
    create(data, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('creating proxy');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('saving proxy to db');
                    const insert = yield this.proxyModel.replaceOne({ _id: instance }, Object.assign({}, data), { upsert: true });
                    this.logger.verbose('proxy saved to db: ' + insert.modifiedCount + ' proxy');
                    return { insertCount: insert.modifiedCount };
                }
                this.logger.verbose('saving proxy to store');
                this.writeStore({
                    path: (0, path_1.join)(this.storePath, 'proxy'),
                    fileName: instance,
                    data,
                });
                this.logger.verbose('proxy saved to store in path: ' + (0, path_1.join)(this.storePath, 'proxy') + '/' + instance);
                this.logger.verbose('proxy created');
                return { insertCount: 1 };
            }
            catch (error) {
                return error;
            }
        });
    }
    find(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('finding proxy');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding proxy in db');
                    return yield this.proxyModel.findOne({ _id: instance });
                }
                this.logger.verbose('finding proxy in store');
                return JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'proxy', instance + '.json'), {
                    encoding: 'utf-8',
                }));
            }
            catch (error) {
                return {};
            }
        });
    }
}
exports.ProxyRepository = ProxyRepository;
