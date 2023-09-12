"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryBroker = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const logger_config_1 = require("../../config/logger.config");
class RepositoryBroker {
    constructor(message, chat, contact, messageUpdate, webhook, chatwoot, settings, websocket, rabbitmq, typebot, proxy, auth, configService, dbServer) {
        this.message = message;
        this.chat = chat;
        this.contact = contact;
        this.messageUpdate = messageUpdate;
        this.webhook = webhook;
        this.chatwoot = chatwoot;
        this.settings = settings;
        this.websocket = websocket;
        this.rabbitmq = rabbitmq;
        this.typebot = typebot;
        this.proxy = proxy;
        this.auth = auth;
        this.configService = configService;
        this.logger = new logger_config_1.Logger('RepositoryBroker');
        this.dbClient = dbServer;
        this.__init_repo_without_db__();
    }
    get dbServer() {
        return this.dbClient;
    }
    __init_repo_without_db__() {
        this.logger.verbose('initializing repository without db');
        if (!this.configService.get('DATABASE').ENABLED) {
            const storePath = (0, path_1.join)(process.cwd(), 'store');
            this.logger.verbose('creating store path: ' + storePath);
            try {
                const authDir = (0, path_1.join)(storePath, 'auth', this.configService.get('AUTHENTICATION').TYPE);
                const chatsDir = (0, path_1.join)(storePath, 'chats');
                const contactsDir = (0, path_1.join)(storePath, 'contacts');
                const messagesDir = (0, path_1.join)(storePath, 'messages');
                const messageUpDir = (0, path_1.join)(storePath, 'message-up');
                const webhookDir = (0, path_1.join)(storePath, 'webhook');
                const chatwootDir = (0, path_1.join)(storePath, 'chatwoot');
                const settingsDir = (0, path_1.join)(storePath, 'settings');
                const websocketDir = (0, path_1.join)(storePath, 'websocket');
                const rabbitmqDir = (0, path_1.join)(storePath, 'rabbitmq');
                const typebotDir = (0, path_1.join)(storePath, 'typebot');
                const proxyDir = (0, path_1.join)(storePath, 'proxy');
                const tempDir = (0, path_1.join)(storePath, 'temp');
                if (!fs_1.default.existsSync(authDir)) {
                    this.logger.verbose('creating auth dir: ' + authDir);
                    fs_1.default.mkdirSync(authDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(chatsDir)) {
                    this.logger.verbose('creating chats dir: ' + chatsDir);
                    fs_1.default.mkdirSync(chatsDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(contactsDir)) {
                    this.logger.verbose('creating contacts dir: ' + contactsDir);
                    fs_1.default.mkdirSync(contactsDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(messagesDir)) {
                    this.logger.verbose('creating messages dir: ' + messagesDir);
                    fs_1.default.mkdirSync(messagesDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(messageUpDir)) {
                    this.logger.verbose('creating message-up dir: ' + messageUpDir);
                    fs_1.default.mkdirSync(messageUpDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(webhookDir)) {
                    this.logger.verbose('creating webhook dir: ' + webhookDir);
                    fs_1.default.mkdirSync(webhookDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(chatwootDir)) {
                    this.logger.verbose('creating chatwoot dir: ' + chatwootDir);
                    fs_1.default.mkdirSync(chatwootDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(settingsDir)) {
                    this.logger.verbose('creating settings dir: ' + settingsDir);
                    fs_1.default.mkdirSync(settingsDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(websocketDir)) {
                    this.logger.verbose('creating websocket dir: ' + websocketDir);
                    fs_1.default.mkdirSync(websocketDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(rabbitmqDir)) {
                    this.logger.verbose('creating rabbitmq dir: ' + rabbitmqDir);
                    fs_1.default.mkdirSync(rabbitmqDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(typebotDir)) {
                    this.logger.verbose('creating typebot dir: ' + typebotDir);
                    fs_1.default.mkdirSync(typebotDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(proxyDir)) {
                    this.logger.verbose('creating proxy dir: ' + proxyDir);
                    fs_1.default.mkdirSync(proxyDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(tempDir)) {
                    this.logger.verbose('creating temp dir: ' + tempDir);
                    fs_1.default.mkdirSync(tempDir, { recursive: true });
                }
            }
            catch (error) {
                this.logger.error(error);
            }
        }
        else {
            try {
                const storePath = (0, path_1.join)(process.cwd(), 'store');
                this.logger.verbose('creating store path: ' + storePath);
                const tempDir = (0, path_1.join)(storePath, 'temp');
                const chatwootDir = (0, path_1.join)(storePath, 'chatwoot');
                if (!fs_1.default.existsSync(chatwootDir)) {
                    this.logger.verbose('creating chatwoot dir: ' + chatwootDir);
                    fs_1.default.mkdirSync(chatwootDir, { recursive: true });
                }
                if (!fs_1.default.existsSync(tempDir)) {
                    this.logger.verbose('creating temp dir: ' + tempDir);
                    fs_1.default.mkdirSync(tempDir, { recursive: true });
                }
            }
            catch (error) {
                this.logger.error(error);
            }
        }
    }
}
exports.RepositoryBroker = RepositoryBroker;
