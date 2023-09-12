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
exports.ChatwootRepository = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class ChatwootRepository extends abstract_repository_1.Repository {
    constructor(chatwootModel, configService) {
        super(configService);
        this.chatwootModel = chatwootModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('ChatwootRepository');
    }
    create(data, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('creating chatwoot');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('saving chatwoot to db');
                    const insert = yield this.chatwootModel.replaceOne({ _id: instance }, Object.assign({}, data), { upsert: true });
                    this.logger.verbose('chatwoot saved to db: ' + insert.modifiedCount + ' chatwoot');
                    return { insertCount: insert.modifiedCount };
                }
                this.logger.verbose('saving chatwoot to store');
                this.writeStore({
                    path: (0, path_1.join)(this.storePath, 'chatwoot'),
                    fileName: instance,
                    data,
                });
                this.logger.verbose('chatwoot saved to store in path: ' + (0, path_1.join)(this.storePath, 'chatwoot') + '/' + instance);
                this.logger.verbose('chatwoot created');
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
                this.logger.verbose('finding chatwoot');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding chatwoot in db');
                    return yield this.chatwootModel.findOne({ _id: instance });
                }
                this.logger.verbose('finding chatwoot in store');
                return JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'chatwoot', instance + '.json'), {
                    encoding: 'utf-8',
                }));
            }
            catch (error) {
                return {};
            }
        });
    }
}
exports.ChatwootRepository = ChatwootRepository;
