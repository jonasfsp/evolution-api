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
exports.WebhookRepository = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class WebhookRepository extends abstract_repository_1.Repository {
    constructor(webhookModel, configService) {
        super(configService);
        this.webhookModel = webhookModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('WebhookRepository');
    }
    create(data, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('creating webhook');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('saving webhook to db');
                    const insert = yield this.webhookModel.replaceOne({ _id: instance }, Object.assign({}, data), { upsert: true });
                    this.logger.verbose('webhook saved to db: ' + insert.modifiedCount + ' webhook');
                    return { insertCount: insert.modifiedCount };
                }
                this.logger.verbose('saving webhook to store');
                this.writeStore({
                    path: (0, path_1.join)(this.storePath, 'webhook'),
                    fileName: instance,
                    data,
                });
                this.logger.verbose('webhook saved to store in path: ' + (0, path_1.join)(this.storePath, 'webhook') + '/' + instance);
                this.logger.verbose('webhook created');
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
                this.logger.verbose('finding webhook');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding webhook in db');
                    return yield this.webhookModel.findOne({ _id: instance });
                }
                this.logger.verbose('finding webhook in store');
                return JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'webhook', instance + '.json'), {
                    encoding: 'utf-8',
                }));
            }
            catch (error) {
                return {};
            }
        });
    }
}
exports.WebhookRepository = WebhookRepository;
