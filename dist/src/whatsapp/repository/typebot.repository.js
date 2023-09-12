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
exports.TypebotRepository = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
const abstract_repository_1 = require("../abstract/abstract.repository");
class TypebotRepository extends abstract_repository_1.Repository {
    constructor(typebotModel, configService) {
        super(configService);
        this.typebotModel = typebotModel;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('TypebotRepository');
    }
    create(data, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose('creating typebot');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('saving typebot to db');
                    const insert = yield this.typebotModel.replaceOne({ _id: instance }, Object.assign({}, data), { upsert: true });
                    this.logger.verbose('typebot saved to db: ' + insert.modifiedCount + ' typebot');
                    return { insertCount: insert.modifiedCount };
                }
                this.logger.verbose('saving typebot to store');
                this.writeStore({
                    path: (0, path_1.join)(this.storePath, 'typebot'),
                    fileName: instance,
                    data,
                });
                this.logger.verbose('typebot saved to store in path: ' + (0, path_1.join)(this.storePath, 'typebot') + '/' + instance);
                this.logger.verbose('typebot created');
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
                this.logger.verbose('finding typebot');
                if (this.dbSettings.ENABLED) {
                    this.logger.verbose('finding typebot in db');
                    return yield this.typebotModel.findOne({ _id: instance });
                }
                this.logger.verbose('finding typebot in store');
                return JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(this.storePath, 'typebot', instance + '.json'), {
                    encoding: 'utf-8',
                }));
            }
            catch (error) {
                return {
                    enabled: false,
                    url: '',
                    typebot: '',
                    expire: 0,
                    sessions: [],
                };
            }
        });
    }
}
exports.TypebotRepository = TypebotRepository;
