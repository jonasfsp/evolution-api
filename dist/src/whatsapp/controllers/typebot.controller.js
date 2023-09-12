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
exports.TypebotController = void 0;
const logger_config_1 = require("../../config/logger.config");
const logger = new logger_config_1.Logger('TypebotController');
class TypebotController {
    constructor(typebotService) {
        this.typebotService = typebotService;
    }
    createTypebot(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested createTypebot from ' + instance.instanceName + ' instance');
            if (!data.enabled) {
                logger.verbose('typebot disabled');
                data.url = '';
                data.typebot = '';
                data.expire = 0;
                data.sessions = [];
            }
            else {
                const saveData = yield this.typebotService.find(instance);
                if (saveData.enabled) {
                    logger.verbose('typebot enabled');
                    data.sessions = saveData.sessions;
                }
            }
            return this.typebotService.create(instance, data);
        });
    }
    findTypebot(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findTypebot from ' + instance.instanceName + ' instance');
            return this.typebotService.find(instance);
        });
    }
    changeStatus(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested changeStatus from ' + instance.instanceName + ' instance');
            return this.typebotService.changeStatus(instance, data);
        });
    }
    startTypebot(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested startTypebot from ' + instance.instanceName + ' instance');
            return this.typebotService.startTypebot(instance, data);
        });
    }
}
exports.TypebotController = TypebotController;
