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
exports.RouterBroker = void 0;
require("express-async-errors");
const jsonschema_1 = require("jsonschema");
const logger_config_1 = require("../../config/logger.config");
const exceptions_1 = require("../../exceptions");
const logger = new logger_config_1.Logger('Validate');
class RouterBroker {
    constructor() { }
    routerPath(path, param = true) {
        let route = '/' + path;
        param ? (route += '/:instanceName') : null;
        return route;
    }
    dataValidate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { request, schema, ClassRef, execute } = args;
            const ref = new ClassRef();
            const body = request.body;
            const instance = request.params;
            if ((request === null || request === void 0 ? void 0 : request.query) && Object.keys(request.query).length > 0) {
                Object.assign(instance, request.query);
            }
            if (request.originalUrl.includes('/instance/create')) {
                Object.assign(instance, body);
            }
            Object.assign(ref, body);
            const v = schema ? (0, jsonschema_1.validate)(ref, schema) : { valid: true, errors: [] };
            if (!v.valid) {
                const message = v.errors.map(({ stack, schema }) => {
                    let message;
                    if (schema['description']) {
                        message = schema['description'];
                    }
                    else {
                        message = stack.replace('instance.', '');
                    }
                    return message;
                });
                logger.error(message);
                throw new exceptions_1.BadRequestException(message);
            }
            return yield execute(instance, ref);
        });
    }
    groupNoValidate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { request, ClassRef, schema, execute } = args;
            const instance = request.params;
            const ref = new ClassRef();
            Object.assign(ref, request.body);
            const v = (0, jsonschema_1.validate)(ref, schema);
            if (!v.valid) {
                const message = v.errors.map(({ property, stack, schema }) => {
                    let message;
                    if (schema['description']) {
                        message = schema['description'];
                    }
                    else {
                        message = stack.replace('instance.', '');
                    }
                    return {
                        property: property.replace('instance.', ''),
                        message,
                    };
                });
                logger.error([...message]);
                throw new exceptions_1.BadRequestException(...message);
            }
            return yield execute(instance, ref);
        });
    }
    groupValidate(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { request, ClassRef, schema, execute } = args;
            const instance = request.params;
            const body = request.body;
            let groupJid = body === null || body === void 0 ? void 0 : body.groupJid;
            if (!groupJid) {
                if ((_a = request.query) === null || _a === void 0 ? void 0 : _a.groupJid) {
                    groupJid = request.query.groupJid;
                }
                else {
                    throw new exceptions_1.BadRequestException('The group id needs to be informed in the query', 'ex: "groupJid=120362@g.us"');
                }
            }
            if (!groupJid.endsWith('@g.us')) {
                groupJid = groupJid + '@g.us';
            }
            Object.assign(body, {
                groupJid: groupJid,
            });
            const ref = new ClassRef();
            Object.assign(ref, body);
            const v = (0, jsonschema_1.validate)(ref, schema);
            if (!v.valid) {
                const message = v.errors.map(({ property, stack, schema }) => {
                    let message;
                    if (schema['description']) {
                        message = schema['description'];
                    }
                    else {
                        message = stack.replace('instance.', '');
                    }
                    return {
                        property: property.replace('instance.', ''),
                        message,
                    };
                });
                logger.error([...message]);
                throw new exceptions_1.BadRequestException(...message);
            }
            return yield execute(instance, ref);
        });
    }
    inviteCodeValidate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { request, ClassRef, schema, execute } = args;
            const inviteCode = request.query;
            if (!(inviteCode === null || inviteCode === void 0 ? void 0 : inviteCode.inviteCode)) {
                throw new exceptions_1.BadRequestException('The group invite code id needs to be informed in the query', 'ex: "inviteCode=F1EX5QZxO181L3TMVP31gY" (Obtained from group join link)');
            }
            const instance = request.params;
            const body = request.body;
            const ref = new ClassRef();
            Object.assign(body, inviteCode);
            Object.assign(ref, body);
            const v = (0, jsonschema_1.validate)(ref, schema);
            if (!v.valid) {
                const message = v.errors.map(({ property, stack, schema }) => {
                    let message;
                    if (schema['description']) {
                        message = schema['description'];
                    }
                    else {
                        message = stack.replace('instance.', '');
                    }
                    return {
                        property: property.replace('instance.', ''),
                        message,
                    };
                });
                logger.error([...message]);
                throw new exceptions_1.BadRequestException(...message);
            }
            return yield execute(instance, ref);
        });
    }
    getParticipantsValidate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { request, ClassRef, schema, execute } = args;
            const getParticipants = request.query;
            if (!(getParticipants === null || getParticipants === void 0 ? void 0 : getParticipants.getParticipants)) {
                throw new exceptions_1.BadRequestException('The getParticipants needs to be informed in the query');
            }
            const instance = request.params;
            const body = request.body;
            const ref = new ClassRef();
            Object.assign(body, getParticipants);
            Object.assign(ref, body);
            const v = (0, jsonschema_1.validate)(ref, schema);
            if (!v.valid) {
                const message = v.errors.map(({ property, stack, schema }) => {
                    let message;
                    if (schema['description']) {
                        message = schema['description'];
                    }
                    else {
                        message = stack.replace('instance.', '');
                    }
                    return {
                        property: property.replace('instance.', ''),
                        message,
                    };
                });
                logger.error([...message]);
                throw new exceptions_1.BadRequestException(...message);
            }
            return yield execute(instance, ref);
        });
    }
}
exports.RouterBroker = RouterBroker;
