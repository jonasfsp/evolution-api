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
exports.ChatController = void 0;
const logger_config_1 = require("../../config/logger.config");
const logger = new logger_config_1.Logger('ChatController');
class ChatController {
    constructor(waMonitor) {
        this.waMonitor = waMonitor;
    }
    whatsappNumber({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested whatsappNumber from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].whatsappNumber(data);
        });
    }
    readMessage({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested readMessage from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].markMessageAsRead(data);
        });
    }
    archiveChat({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested archiveChat from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].archiveChat(data);
        });
    }
    deleteMessage({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested deleteMessage from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].deleteMessage(data);
        });
    }
    fetchProfilePicture({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchProfilePicture from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].profilePicture(data.number);
        });
    }
    fetchProfile({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchProfile from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].fetchProfile(instanceName, data.number);
        });
    }
    fetchContacts({ instanceName }, query) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchContacts from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].fetchContacts(query);
        });
    }
    getBase64FromMediaMessage({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested getBase64FromMediaMessage from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].getBase64FromMediaMessage(data);
        });
    }
    fetchMessages({ instanceName }, query) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchMessages from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].fetchMessages(query);
        });
    }
    fetchStatusMessage({ instanceName }, query) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchStatusMessage from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].fetchStatusMessage(query);
        });
    }
    fetchChats({ instanceName }) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchChats from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].fetchChats();
        });
    }
    fetchPrivacySettings({ instanceName }) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchPrivacySettings from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].fetchPrivacySettings();
        });
    }
    updatePrivacySettings({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updatePrivacySettings from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].updatePrivacySettings(data);
        });
    }
    fetchBusinessProfile({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchBusinessProfile from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].fetchBusinessProfile(data.number);
        });
    }
    updateProfileName({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateProfileName from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].updateProfileName(data.name);
        });
    }
    updateProfileStatus({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateProfileStatus from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].updateProfileStatus(data.status);
        });
    }
    updateProfilePicture({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateProfilePicture from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].updateProfilePicture(data.picture);
        });
    }
    removeProfilePicture({ instanceName }) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested removeProfilePicture from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].removeProfilePicture();
        });
    }
}
exports.ChatController = ChatController;
