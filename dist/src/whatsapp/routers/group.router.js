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
exports.GroupRouter = void 0;
const express_1 = require("express");
const logger_config_1 = require("../../config/logger.config");
const validate_schema_1 = require("../../validate/validate.schema");
const abstract_router_1 = require("../abstract/abstract.router");
const group_dto_1 = require("../dto/group.dto");
const whatsapp_module_1 = require("../whatsapp.module");
const index_router_1 = require("./index.router");
const logger = new logger_config_1.Logger('GroupRouter');
class GroupRouter extends abstract_router_1.RouterBroker {
    constructor(...guards) {
        super();
        this.router = (0, express_1.Router)();
        this.router
            .post(this.routerPath('create'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in createGroup');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.createGroupSchema,
                ClassRef: group_dto_1.CreateGroupDto,
                execute: (instance, data) => whatsapp_module_1.groupController.createGroup(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .put(this.routerPath('updateGroupSubject'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in updateGroupSubject');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.updateGroupSubjectSchema,
                ClassRef: group_dto_1.GroupSubjectDto,
                execute: (instance, data) => whatsapp_module_1.groupController.updateGroupSubject(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .put(this.routerPath('updateGroupPicture'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in updateGroupPicture');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.updateGroupPictureSchema,
                ClassRef: group_dto_1.GroupPictureDto,
                execute: (instance, data) => whatsapp_module_1.groupController.updateGroupPicture(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .put(this.routerPath('updateGroupDescription'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in updateGroupDescription');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.updateGroupDescriptionSchema,
                ClassRef: group_dto_1.GroupDescriptionDto,
                execute: (instance, data) => whatsapp_module_1.groupController.updateGroupDescription(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .get(this.routerPath('findGroupInfos'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in findGroupInfos');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.groupJidSchema,
                ClassRef: group_dto_1.GroupJid,
                execute: (instance, data) => whatsapp_module_1.groupController.findGroupInfo(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .get(this.routerPath('fetchAllGroups'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in fetchAllGroups');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.getParticipantsValidate({
                request: req,
                schema: validate_schema_1.getParticipantsSchema,
                ClassRef: group_dto_1.GetParticipant,
                execute: (instance, data) => whatsapp_module_1.groupController.fetchAllGroups(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .get(this.routerPath('participants'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in participants');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.groupJidSchema,
                ClassRef: group_dto_1.GroupJid,
                execute: (instance, data) => whatsapp_module_1.groupController.findParticipants(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .get(this.routerPath('inviteCode'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in inviteCode');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.groupJidSchema,
                ClassRef: group_dto_1.GroupJid,
                execute: (instance, data) => whatsapp_module_1.groupController.inviteCode(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .get(this.routerPath('inviteInfo'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in inviteInfo');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.inviteCodeValidate({
                request: req,
                schema: validate_schema_1.groupInviteSchema,
                ClassRef: group_dto_1.GroupInvite,
                execute: (instance, data) => whatsapp_module_1.groupController.inviteInfo(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .post(this.routerPath('sendInvite'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in sendInvite');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupNoValidate({
                request: req,
                schema: validate_schema_1.groupSendInviteSchema,
                ClassRef: group_dto_1.GroupSendInvite,
                execute: (instance, data) => whatsapp_module_1.groupController.sendInvite(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .put(this.routerPath('revokeInviteCode'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in revokeInviteCode');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.groupJidSchema,
                ClassRef: group_dto_1.GroupJid,
                execute: (instance, data) => whatsapp_module_1.groupController.revokeInviteCode(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .put(this.routerPath('updateParticipant'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in updateParticipant');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.updateParticipantsSchema,
                ClassRef: group_dto_1.GroupUpdateParticipantDto,
                execute: (instance, data) => whatsapp_module_1.groupController.updateGParticipate(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .put(this.routerPath('updateSetting'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in updateSetting');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.updateSettingsSchema,
                ClassRef: group_dto_1.GroupUpdateSettingDto,
                execute: (instance, data) => whatsapp_module_1.groupController.updateGSetting(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .put(this.routerPath('toggleEphemeral'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in toggleEphemeral');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: validate_schema_1.toggleEphemeralSchema,
                ClassRef: group_dto_1.GroupToggleEphemeralDto,
                execute: (instance, data) => whatsapp_module_1.groupController.toggleEphemeral(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .delete(this.routerPath('leaveGroup'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in leaveGroup');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.groupValidate({
                request: req,
                schema: {},
                ClassRef: group_dto_1.GroupJid,
                execute: (instance, data) => whatsapp_module_1.groupController.leaveGroup(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }));
    }
}
exports.GroupRouter = GroupRouter;
