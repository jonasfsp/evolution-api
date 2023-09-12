"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.HttpStatus = void 0;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const env_config_1 = require("../../config/env.config");
const auth_guard_1 = require("../guards/auth.guard");
const instance_guard_1 = require("../guards/instance.guard");
const chat_router_1 = require("./chat.router");
const chatwoot_router_1 = require("./chatwoot.router");
const group_router_1 = require("./group.router");
const instance_router_1 = require("./instance.router");
const proxy_router_1 = require("./proxy.router");
const rabbitmq_router_1 = require("./rabbitmq.router");
const sendMessage_router_1 = require("./sendMessage.router");
const settings_router_1 = require("./settings.router");
const typebot_router_1 = require("./typebot.router");
const view_router_1 = require("./view.router");
const webhook_router_1 = require("./webhook.router");
const websocket_router_1 = require("./websocket.router");
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatus || (HttpStatus = {}));
exports.HttpStatus = HttpStatus;
const router = (0, express_1.Router)();
exports.router = router;
const authType = env_config_1.configService.get('AUTHENTICATION').TYPE;
const guards = [instance_guard_1.instanceExistsGuard, instance_guard_1.instanceLoggedGuard, auth_guard_1.authGuard[authType]];
const packageJson = JSON.parse(fs_1.default.readFileSync('./package.json', 'utf8'));
router
    .get('/', (req, res) => {
    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Welcome to the Evolution API, it is working!',
        version: packageJson.version,
    });
})
    .use('/instance', new instance_router_1.InstanceRouter(env_config_1.configService, ...guards).router)
    .use('/manager', new view_router_1.ViewsRouter().router)
    .use('/message', new sendMessage_router_1.MessageRouter(...guards).router)
    .use('/chat', new chat_router_1.ChatRouter(...guards).router)
    .use('/group', new group_router_1.GroupRouter(...guards).router)
    .use('/webhook', new webhook_router_1.WebhookRouter(...guards).router)
    .use('/chatwoot', new chatwoot_router_1.ChatwootRouter(...guards).router)
    .use('/settings', new settings_router_1.SettingsRouter(...guards).router)
    .use('/websocket', new websocket_router_1.WebsocketRouter(...guards).router)
    .use('/rabbitmq', new rabbitmq_router_1.RabbitmqRouter(...guards).router)
    .use('/typebot', new typebot_router_1.TypebotRouter(...guards).router)
    .use('/proxy', new proxy_router_1.ProxyRouter(...guards).router);
