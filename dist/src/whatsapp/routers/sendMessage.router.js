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
exports.MessageRouter = void 0;
const express_1 = require("express");
const logger_config_1 = require("../../config/logger.config");
const validate_schema_1 = require("../../validate/validate.schema");
const abstract_router_1 = require("../abstract/abstract.router");
const sendMessage_dto_1 = require("../dto/sendMessage.dto");
const whatsapp_module_1 = require("../whatsapp.module");
const index_router_1 = require("./index.router");
const logger = new logger_config_1.Logger('MessageRouter');
class MessageRouter extends abstract_router_1.RouterBroker {
    constructor(...guards) {
        super();
        this.router = (0, express_1.Router)();
        this.router
            .post(this.routerPath('sendText'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendText');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.textMessageSchema,
                ClassRef: sendMessage_dto_1.SendTextDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendText(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendMedia'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendMedia');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.mediaMessageSchema,
                ClassRef: sendMessage_dto_1.SendMediaDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendMedia(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendWhatsAppAudio'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendWhatsAppAudio');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.audioMessageSchema,
                ClassRef: sendMessage_dto_1.SendMediaDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendWhatsAppAudio(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendButtons'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendButtons');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.buttonMessageSchema,
                ClassRef: sendMessage_dto_1.SendButtonDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendButtons(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendLocation'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendLocation');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.locationMessageSchema,
                ClassRef: sendMessage_dto_1.SendLocationDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendLocation(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendList'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendList');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.listMessageSchema,
                ClassRef: sendMessage_dto_1.SendListDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendList(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendContact'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendContact');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.contactMessageSchema,
                ClassRef: sendMessage_dto_1.SendContactDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendContact(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendReaction'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendReaction');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.reactionMessageSchema,
                ClassRef: sendMessage_dto_1.SendReactionDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendReaction(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendPoll'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendPoll');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.pollMessageSchema,
                ClassRef: sendMessage_dto_1.SendPollDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendPoll(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendStatus'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendStatus');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.statusMessageSchema,
                ClassRef: sendMessage_dto_1.SendStatusDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendStatus(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .post(this.routerPath('sendSticker'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendSticker');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.stickerMessageSchema,
                ClassRef: sendMessage_dto_1.SendStickerDto,
                execute: (instance, data) => whatsapp_module_1.sendMessageController.sendSticker(instance, data),
            });
            return res.status(index_router_1.HttpStatus.CREATED).json(response);
        }));
    }
}
exports.MessageRouter = MessageRouter;
