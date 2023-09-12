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
exports.SendMessageController = void 0;
const class_validator_1 = require("class-validator");
const logger_config_1 = require("../../config/logger.config");
const exceptions_1 = require("../../exceptions");
const logger = new logger_config_1.Logger('MessageRouter');
class SendMessageController {
    constructor(waMonitor) {
        this.waMonitor = waMonitor;
    }
    sendText({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendText from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].textMessage(data);
        });
    }
    sendMedia({ instanceName }, data) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendMedia from ' + instanceName + ' instance');
            if ((0, class_validator_1.isBase64)((_a = data === null || data === void 0 ? void 0 : data.mediaMessage) === null || _a === void 0 ? void 0 : _a.media) &&
                !((_b = data === null || data === void 0 ? void 0 : data.mediaMessage) === null || _b === void 0 ? void 0 : _b.fileName) &&
                ((_c = data === null || data === void 0 ? void 0 : data.mediaMessage) === null || _c === void 0 ? void 0 : _c.mediatype) === 'document') {
                throw new exceptions_1.BadRequestException('For base64 the file name must be informed.');
            }
            logger.verbose('isURL: ' + (0, class_validator_1.isURL)((_d = data === null || data === void 0 ? void 0 : data.mediaMessage) === null || _d === void 0 ? void 0 : _d.media) + ', isBase64: ' + (0, class_validator_1.isBase64)((_e = data === null || data === void 0 ? void 0 : data.mediaMessage) === null || _e === void 0 ? void 0 : _e.media));
            if ((0, class_validator_1.isURL)((_f = data === null || data === void 0 ? void 0 : data.mediaMessage) === null || _f === void 0 ? void 0 : _f.media) || (0, class_validator_1.isBase64)((_g = data === null || data === void 0 ? void 0 : data.mediaMessage) === null || _g === void 0 ? void 0 : _g.media)) {
                return yield this.waMonitor.waInstances[instanceName].mediaMessage(data);
            }
            throw new exceptions_1.BadRequestException('Owned media must be a url or base64');
        });
    }
    sendSticker({ instanceName }, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendSticker from ' + instanceName + ' instance');
            logger.verbose('isURL: ' + (0, class_validator_1.isURL)((_a = data === null || data === void 0 ? void 0 : data.stickerMessage) === null || _a === void 0 ? void 0 : _a.image) + ', isBase64: ' + (0, class_validator_1.isBase64)((_b = data === null || data === void 0 ? void 0 : data.stickerMessage) === null || _b === void 0 ? void 0 : _b.image));
            if ((0, class_validator_1.isURL)(data.stickerMessage.image) || (0, class_validator_1.isBase64)(data.stickerMessage.image)) {
                return yield this.waMonitor.waInstances[instanceName].mediaSticker(data);
            }
            throw new exceptions_1.BadRequestException('Owned media must be a url or base64');
        });
    }
    sendWhatsAppAudio({ instanceName }, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendWhatsAppAudio from ' + instanceName + ' instance');
            logger.verbose('isURL: ' + (0, class_validator_1.isURL)((_a = data === null || data === void 0 ? void 0 : data.audioMessage) === null || _a === void 0 ? void 0 : _a.audio) + ', isBase64: ' + (0, class_validator_1.isBase64)((_b = data === null || data === void 0 ? void 0 : data.audioMessage) === null || _b === void 0 ? void 0 : _b.audio));
            if ((0, class_validator_1.isURL)(data.audioMessage.audio) || (0, class_validator_1.isBase64)(data.audioMessage.audio)) {
                return yield this.waMonitor.waInstances[instanceName].audioWhatsapp(data);
            }
            throw new exceptions_1.BadRequestException('Owned media must be a url or base64');
        });
    }
    sendButtons({ instanceName }, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendButtons from ' + instanceName + ' instance');
            if ((0, class_validator_1.isBase64)((_a = data.buttonMessage.mediaMessage) === null || _a === void 0 ? void 0 : _a.media) && !((_b = data.buttonMessage.mediaMessage) === null || _b === void 0 ? void 0 : _b.fileName)) {
                throw new exceptions_1.BadRequestException('For bse64 the file name must be informed.');
            }
            return yield this.waMonitor.waInstances[instanceName].buttonMessage(data);
        });
    }
    sendLocation({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendLocation from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].locationMessage(data);
        });
    }
    sendList({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendList from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].listMessage(data);
        });
    }
    sendContact({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendContact from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].contactMessage(data);
        });
    }
    sendReaction({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendReaction from ' + instanceName + ' instance');
            if (!data.reactionMessage.reaction.match(/[^()\w\sà-ú"-+]+/)) {
                throw new exceptions_1.BadRequestException('"reaction" must be an emoji');
            }
            return yield this.waMonitor.waInstances[instanceName].reactionMessage(data);
        });
    }
    sendPoll({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendPoll from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].pollMessage(data);
        });
    }
    sendStatus({ instanceName }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendStatus from ' + instanceName + ' instance');
            return yield this.waMonitor.waInstances[instanceName].statusMessage(data);
        });
    }
}
exports.SendMessageController = SendMessageController;
