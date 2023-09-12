"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = exports.ConfigService = void 0;
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const path_1 = require("path");
class ConfigService {
    constructor() {
        this.loadEnv();
    }
    get(key) {
        return this.env[key];
    }
    loadEnv() {
        var _a, _b, _c;
        this.env = !(((_a = process.env) === null || _a === void 0 ? void 0 : _a.DOCKER_ENV) === 'true') ? this.envYaml() : this.envProcess();
        this.env.PRODUCTION = ((_b = process.env) === null || _b === void 0 ? void 0 : _b.NODE_ENV) === 'PROD';
        if (((_c = process.env) === null || _c === void 0 ? void 0 : _c.DOCKER_ENV) === 'true') {
            this.env.SERVER.TYPE = 'http';
            this.env.SERVER.PORT = 8083;
        }
    }
    envYaml() {
        return (0, js_yaml_1.load)((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'src', 'env.yml'), { encoding: 'utf-8' }));
    }
    envProcess() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28;
        return {
            SERVER: {
                TYPE: process.env.SERVER_TYPE,
                PORT: Number.parseInt(process.env.SERVER_PORT),
                URL: process.env.SERVER_URL,
            },
            CORS: {
                ORIGIN: process.env.CORS_ORIGIN.split(','),
                METHODS: process.env.CORS_METHODS.split(','),
                CREDENTIALS: ((_a = process.env) === null || _a === void 0 ? void 0 : _a.CORS_CREDENTIALS) === 'true',
            },
            SSL_CONF: {
                PRIVKEY: (_b = process.env) === null || _b === void 0 ? void 0 : _b.SSL_CONF_PRIVKEY,
                FULLCHAIN: (_c = process.env) === null || _c === void 0 ? void 0 : _c.SSL_CONF_FULLCHAIN,
            },
            STORE: {
                MESSAGES: ((_d = process.env) === null || _d === void 0 ? void 0 : _d.STORE_MESSAGES) === 'true',
                MESSAGE_UP: ((_e = process.env) === null || _e === void 0 ? void 0 : _e.STORE_MESSAGE_UP) === 'true',
                CONTACTS: ((_f = process.env) === null || _f === void 0 ? void 0 : _f.STORE_CONTACTS) === 'true',
                CHATS: ((_g = process.env) === null || _g === void 0 ? void 0 : _g.STORE_CHATS) === 'true',
            },
            CLEAN_STORE: {
                CLEANING_INTERVAL: Number.isInteger((_h = process.env) === null || _h === void 0 ? void 0 : _h.CLEAN_STORE_CLEANING_TERMINAL)
                    ? Number.parseInt(process.env.CLEAN_STORE_CLEANING_TERMINAL)
                    : 7200,
                MESSAGES: ((_j = process.env) === null || _j === void 0 ? void 0 : _j.CLEAN_STORE_MESSAGES) === 'true',
                MESSAGE_UP: ((_k = process.env) === null || _k === void 0 ? void 0 : _k.CLEAN_STORE_MESSAGE_UP) === 'true',
                CONTACTS: ((_l = process.env) === null || _l === void 0 ? void 0 : _l.CLEAN_STORE_CONTACTS) === 'true',
                CHATS: ((_m = process.env) === null || _m === void 0 ? void 0 : _m.CLEAN_STORE_CHATS) === 'true',
            },
            DATABASE: {
                CONNECTION: {
                    URI: process.env.DATABASE_CONNECTION_URI,
                    DB_PREFIX_NAME: process.env.DATABASE_CONNECTION_DB_PREFIX_NAME,
                },
                ENABLED: ((_o = process.env) === null || _o === void 0 ? void 0 : _o.DATABASE_ENABLED) === 'true',
                SAVE_DATA: {
                    INSTANCE: ((_p = process.env) === null || _p === void 0 ? void 0 : _p.DATABASE_SAVE_DATA_INSTANCE) === 'true',
                    NEW_MESSAGE: ((_q = process.env) === null || _q === void 0 ? void 0 : _q.DATABASE_SAVE_DATA_NEW_MESSAGE) === 'true',
                    MESSAGE_UPDATE: ((_r = process.env) === null || _r === void 0 ? void 0 : _r.DATABASE_SAVE_MESSAGE_UPDATE) === 'true',
                    CONTACTS: ((_s = process.env) === null || _s === void 0 ? void 0 : _s.DATABASE_SAVE_DATA_CONTACTS) === 'true',
                    CHATS: ((_t = process.env) === null || _t === void 0 ? void 0 : _t.DATABASE_SAVE_DATA_CHATS) === 'true',
                },
            },
            REDIS: {
                ENABLED: ((_u = process.env) === null || _u === void 0 ? void 0 : _u.REDIS_ENABLED) === 'true',
                URI: process.env.REDIS_URI,
                PREFIX_KEY: process.env.REDIS_PREFIX_KEY,
            },
            RABBITMQ: {
                ENABLED: ((_v = process.env) === null || _v === void 0 ? void 0 : _v.RABBITMQ_ENABLED) === 'true',
                URI: process.env.RABBITMQ_URI,
            },
            WEBSOCKET: {
                ENABLED: ((_w = process.env) === null || _w === void 0 ? void 0 : _w.WEBSOCKET_ENABLED) === 'true',
            },
            LOG: {
                LEVEL: (_x = process.env) === null || _x === void 0 ? void 0 : _x.LOG_LEVEL.split(','),
                COLOR: ((_y = process.env) === null || _y === void 0 ? void 0 : _y.LOG_COLOR) === 'true',
                BAILEYS: ((_z = process.env) === null || _z === void 0 ? void 0 : _z.LOG_BAILEYS) || 'error',
            },
            DEL_INSTANCE: ((_0 = process.env) === null || _0 === void 0 ? void 0 : _0.DEL_INSTANCE) === 'true'
                ? 5
                : Number.parseInt(process.env.DEL_INSTANCE) || false,
            WEBHOOK: {
                GLOBAL: {
                    URL: (_1 = process.env) === null || _1 === void 0 ? void 0 : _1.WEBHOOK_GLOBAL_URL,
                    ENABLED: ((_2 = process.env) === null || _2 === void 0 ? void 0 : _2.WEBHOOK_GLOBAL_ENABLED) === 'true',
                    WEBHOOK_BY_EVENTS: ((_3 = process.env) === null || _3 === void 0 ? void 0 : _3.WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS) === 'true',
                },
                EVENTS: {
                    APPLICATION_STARTUP: ((_4 = process.env) === null || _4 === void 0 ? void 0 : _4.WEBHOOK_EVENTS_APPLICATION_STARTUP) === 'true',
                    QRCODE_UPDATED: ((_5 = process.env) === null || _5 === void 0 ? void 0 : _5.WEBHOOK_EVENTS_QRCODE_UPDATED) === 'true',
                    MESSAGES_SET: ((_6 = process.env) === null || _6 === void 0 ? void 0 : _6.WEBHOOK_EVENTS_MESSAGES_SET) === 'true',
                    MESSAGES_UPSERT: ((_7 = process.env) === null || _7 === void 0 ? void 0 : _7.WEBHOOK_EVENTS_MESSAGES_UPSERT) === 'true',
                    MESSAGES_UPDATE: ((_8 = process.env) === null || _8 === void 0 ? void 0 : _8.WEBHOOK_EVENTS_MESSAGES_UPDATE) === 'true',
                    MESSAGES_DELETE: ((_9 = process.env) === null || _9 === void 0 ? void 0 : _9.WEBHOOK_EVENTS_MESSAGES_DELETE) === 'true',
                    SEND_MESSAGE: ((_10 = process.env) === null || _10 === void 0 ? void 0 : _10.WEBHOOK_EVENTS_SEND_MESSAGE) === 'true',
                    CONTACTS_SET: ((_11 = process.env) === null || _11 === void 0 ? void 0 : _11.WEBHOOK_EVENTS_CONTACTS_SET) === 'true',
                    CONTACTS_UPDATE: ((_12 = process.env) === null || _12 === void 0 ? void 0 : _12.WEBHOOK_EVENTS_CONTACTS_UPDATE) === 'true',
                    CONTACTS_UPSERT: ((_13 = process.env) === null || _13 === void 0 ? void 0 : _13.WEBHOOK_EVENTS_CONTACTS_UPSERT) === 'true',
                    PRESENCE_UPDATE: ((_14 = process.env) === null || _14 === void 0 ? void 0 : _14.WEBHOOK_EVENTS_PRESENCE_UPDATE) === 'true',
                    CHATS_SET: ((_15 = process.env) === null || _15 === void 0 ? void 0 : _15.WEBHOOK_EVENTS_CHATS_SET) === 'true',
                    CHATS_UPDATE: ((_16 = process.env) === null || _16 === void 0 ? void 0 : _16.WEBHOOK_EVENTS_CHATS_UPDATE) === 'true',
                    CHATS_UPSERT: ((_17 = process.env) === null || _17 === void 0 ? void 0 : _17.WEBHOOK_EVENTS_CHATS_UPSERT) === 'true',
                    CHATS_DELETE: ((_18 = process.env) === null || _18 === void 0 ? void 0 : _18.WEBHOOK_EVENTS_CHATS_DELETE) === 'true',
                    CONNECTION_UPDATE: ((_19 = process.env) === null || _19 === void 0 ? void 0 : _19.WEBHOOK_EVENTS_CONNECTION_UPDATE) === 'true',
                    GROUPS_UPSERT: ((_20 = process.env) === null || _20 === void 0 ? void 0 : _20.WEBHOOK_EVENTS_GROUPS_UPSERT) === 'true',
                    GROUP_UPDATE: ((_21 = process.env) === null || _21 === void 0 ? void 0 : _21.WEBHOOK_EVENTS_GROUPS_UPDATE) === 'true',
                    GROUP_PARTICIPANTS_UPDATE: ((_22 = process.env) === null || _22 === void 0 ? void 0 : _22.WEBHOOK_EVENTS_GROUP_PARTICIPANTS_UPDATE) === 'true',
                    CALL: ((_23 = process.env) === null || _23 === void 0 ? void 0 : _23.WEBHOOK_EVENTS_CALL) === 'true',
                    NEW_JWT_TOKEN: ((_24 = process.env) === null || _24 === void 0 ? void 0 : _24.WEBHOOK_EVENTS_NEW_JWT_TOKEN) === 'true',
                },
            },
            CONFIG_SESSION_PHONE: {
                CLIENT: ((_25 = process.env) === null || _25 === void 0 ? void 0 : _25.CONFIG_SESSION_PHONE_CLIENT) || 'Evolution API',
                NAME: ((_26 = process.env) === null || _26 === void 0 ? void 0 : _26.CONFIG_SESSION_PHONE_NAME) || 'chrome',
            },
            QRCODE: {
                LIMIT: Number.parseInt(process.env.QRCODE_LIMIT) || 30,
                COLOR: process.env.QRCODE_COLOR || '#198754',
            },
            AUTHENTICATION: {
                TYPE: process.env.AUTHENTICATION_TYPE,
                API_KEY: {
                    KEY: process.env.AUTHENTICATION_API_KEY,
                },
                EXPOSE_IN_FETCH_INSTANCES: ((_27 = process.env) === null || _27 === void 0 ? void 0 : _27.AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES) === 'true',
                JWT: {
                    EXPIRIN_IN: Number.isInteger((_28 = process.env) === null || _28 === void 0 ? void 0 : _28.AUTHENTICATION_JWT_EXPIRIN_IN)
                        ? Number.parseInt(process.env.AUTHENTICATION_JWT_EXPIRIN_IN)
                        : 3600,
                    SECRET: process.env.AUTHENTICATION_JWT_SECRET,
                },
            },
        };
    }
}
exports.ConfigService = ConfigService;
exports.configService = new ConfigService();
