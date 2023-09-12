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
exports.WebsocketRepository = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class WebsocketRepository extends abstract_repository_1.Repository {
    constructor(websocketModel, configService) {
        super(configService);
        this.websocketModel = websocketModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('WebsocketRepository');
    }
    create(data, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('creating websocket');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('saving websocket to db');
                    const insert = yield this.websocketModel.replaceOne({ _id: instance }, Object.assign({}, data), { upsert: true });
                    this.logger.verbose('websocket saved to db: ' + insert.modifiedCount + ' websocket');
                    return { insertCount: insert.modifiedCount };
                }
                this.logger.verbose('saving websocket to store');
                this.writeStore({
                    path: (0, path_1.join)(this.storePath, 'websocket'),
                    fileName: instance,
                    data,
                });
                this.logger.verbose('websocket saved to store in path: ' + (0, path_1.join)(this.storePath, 'websocket') + '/' + instance);
                this.logger.verbose('websocket created');
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
                this.logger.verbose('finding websocket');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding websocket in db');
                    return yield this.websocketModel.findOne({ _id: instance });
                }
                this.logger.verbose('finding websocket in store');
                return JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'websocket', instance + '.json'), {
                    encoding: 'utf-8',
                }));
            }
            catch (error) {
                return {};
            }
        });
    }
}
exports.WebsocketRepository = WebsocketRepository;
