export type HttpServer = {
    TYPE: 'http' | 'https';
    PORT: number;
    URL: string;
};
export type HttpMethods = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type Cors = {
    ORIGIN: string[];
    METHODS: HttpMethods[];
    CREDENTIALS: boolean;
};
export type LogBaileys = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
export type LogLevel = 'ERROR' | 'WARN' | 'DEBUG' | 'INFO' | 'LOG' | 'VERBOSE' | 'DARK' | 'WEBHOOKS';
export type Log = {
    LEVEL: LogLevel[];
    COLOR: boolean;
    BAILEYS: LogBaileys;
};
export type SaveData = {
    INSTANCE: boolean;
    NEW_MESSAGE: boolean;
    MESSAGE_UPDATE: boolean;
    CONTACTS: boolean;
    CHATS: boolean;
};
export type StoreConf = {
    MESSAGES: boolean;
    MESSAGE_UP: boolean;
    CONTACTS: boolean;
    CHATS: boolean;
};
export type CleanStoreConf = {
    CLEANING_INTERVAL: number;
    MESSAGES: boolean;
    MESSAGE_UP: boolean;
    CONTACTS: boolean;
    CHATS: boolean;
};
export type DBConnection = {
    URI: string;
    DB_PREFIX_NAME: string;
};
export type Database = {
    CONNECTION: DBConnection;
    ENABLED: boolean;
    SAVE_DATA: SaveData;
};
export type Redis = {
    ENABLED: boolean;
    URI: string;
    PREFIX_KEY: string;
};
export type Rabbitmq = {
    ENABLED: boolean;
    URI: string;
};
export type Websocket = {
    ENABLED: boolean;
};
export type EventsWebhook = {
    APPLICATION_STARTUP: boolean;
    QRCODE_UPDATED: boolean;
    MESSAGES_SET: boolean;
    MESSAGES_UPSERT: boolean;
    MESSAGES_UPDATE: boolean;
    MESSAGES_DELETE: boolean;
    SEND_MESSAGE: boolean;
    CONTACTS_SET: boolean;
    CONTACTS_UPDATE: boolean;
    CONTACTS_UPSERT: boolean;
    PRESENCE_UPDATE: boolean;
    CHATS_SET: boolean;
    CHATS_UPDATE: boolean;
    CHATS_DELETE: boolean;
    CHATS_UPSERT: boolean;
    CONNECTION_UPDATE: boolean;
    GROUPS_UPSERT: boolean;
    GROUP_UPDATE: boolean;
    GROUP_PARTICIPANTS_UPDATE: boolean;
    CALL: boolean;
    NEW_JWT_TOKEN: boolean;
};
export type ApiKey = {
    KEY: string;
};
export type Jwt = {
    EXPIRIN_IN: number;
    SECRET: string;
};
export type Auth = {
    API_KEY: ApiKey;
    EXPOSE_IN_FETCH_INSTANCES: boolean;
    JWT: Jwt;
    TYPE: 'jwt' | 'apikey';
};
export type DelInstance = number | boolean;
export type GlobalWebhook = {
    URL: string;
    ENABLED: boolean;
    WEBHOOK_BY_EVENTS: boolean;
};
export type SslConf = {
    PRIVKEY: string;
    FULLCHAIN: string;
};
export type Webhook = {
    GLOBAL?: GlobalWebhook;
    EVENTS: EventsWebhook;
};
export type ConfigSessionPhone = {
    CLIENT: string;
    NAME: string;
};
export type QrCode = {
    LIMIT: number;
    COLOR: string;
};
export type Production = boolean;
export interface Env {
    SERVER: HttpServer;
    CORS: Cors;
    SSL_CONF: SslConf;
    STORE: StoreConf;
    CLEAN_STORE: CleanStoreConf;
    DATABASE: Database;
    REDIS: Redis;
    RABBITMQ: Rabbitmq;
    WEBSOCKET: Websocket;
    LOG: Log;
    DEL_INSTANCE: DelInstance;
    WEBHOOK: Webhook;
    CONFIG_SESSION_PHONE: ConfigSessionPhone;
    QRCODE: QrCode;
    AUTHENTICATION: Auth;
    PRODUCTION?: Production;
}
export type Key = keyof Env;
export declare class ConfigService {
    constructor();
    private env;
    get<T = any>(key: Key): T;
    private loadEnv;
    private envYaml;
    private envProcess;
}
export declare const configService: ConfigService;
