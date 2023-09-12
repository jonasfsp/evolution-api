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
exports.TypebotRouter = void 0;
const express_1 = require("express");
const logger_config_1 = require("../../config/logger.config");
const validate_schema_1 = require("../../validate/validate.schema");
const abstract_router_1 = require("../abstract/abstract.router");
const instance_dto_1 = require("../dto/instance.dto");
const typebot_dto_1 = require("../dto/typebot.dto");
const whatsapp_module_1 = require("../whatsapp.module");
const index_router_1 = require("./index.router");
const logger = new logger_config_1.Logger('TypebotRouter');
class TypebotRouter extends abstract_router_1.RouterBroker {
    constructor(...guards) {
        super();
        this.router = (0, express_1.Router)();
        this.router
            .post(this.routerPath('set'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in setTypebot');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.typebotSchema,
                ClassRef: typebot_dto_1.TypebotDto,
                execute: (instance, data) => whatsapp_module_1.typebotController.createTypebot(instance, data),
            });
            res.status(index_router_1.HttpStatus.CREATED).json(response);
        }))
            .get(this.routerPath('find'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in findTypebot');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.instanceNameSchema,
                ClassRef: instance_dto_1.InstanceDto,
                execute: (instance) => whatsapp_module_1.typebotController.findTypebot(instance),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .post(this.routerPath('changeStatus'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in changeStatusTypebot');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.typebotStatusSchema,
                ClassRef: instance_dto_1.InstanceDto,
                execute: (instance, data) => whatsapp_module_1.typebotController.changeStatus(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }))
            .post(this.routerPath('start'), ...guards, (req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('request received in startTypebot');
            logger.verbose('request body: ');
            logger.verbose(req.body);
            logger.verbose('request query: ');
            logger.verbose(req.query);
            const response = yield this.dataValidate({
                request: req,
                schema: validate_schema_1.typebotStartSchema,
                ClassRef: instance_dto_1.InstanceDto,
                execute: (instance, data) => whatsapp_module_1.typebotController.startTypebot(instance, data),
            });
            res.status(index_router_1.HttpStatus.OK).json(response);
        }));
    }
}
exports.TypebotRouter = TypebotRouter;
