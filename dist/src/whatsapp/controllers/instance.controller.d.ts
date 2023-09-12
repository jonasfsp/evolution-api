import EventEmitter2 from 'eventemitter2';
import { ConfigService } from '../../config/env.config';
import { RedisCache } from '../../libs/redis.client';
import { InstanceDto } from '../dto/instance.dto';
import { RepositoryBroker } from '../repository/repository.manager';
import { AuthService, OldToken } from '../services/auth.service';
import { ChatwootService } from '../services/chatwoot.service';
import { WAMonitoringService } from '../services/monitor.service';
import { RabbitmqService } from '../services/rabbitmq.service';
import { SettingsService } from '../services/settings.service';
import { TypebotService } from '../services/typebot.service';
import { WebhookService } from '../services/webhook.service';
import { WebsocketService } from '../services/websocket.service';
import { wa } from '../types/wa.types';
export declare class InstanceController {
    private readonly waMonitor;
    private readonly configService;
    private readonly repository;
    private readonly eventEmitter;
    private readonly authService;
    private readonly webhookService;
    private readonly chatwootService;
    private readonly settingsService;
    private readonly websocketService;
    private readonly rabbitmqService;
    private readonly typebotService;
    private readonly cache;
    constructor(waMonitor: WAMonitoringService, configService: ConfigService, repository: RepositoryBroker, eventEmitter: EventEmitter2, authService: AuthService, webhookService: WebhookService, chatwootService: ChatwootService, settingsService: SettingsService, websocketService: WebsocketService, rabbitmqService: RabbitmqService, typebotService: TypebotService, cache: RedisCache);
    private readonly logger;
    createInstance({ instanceName, webhook, webhook_by_events, events, qrcode, number, token, chatwoot_account_id, chatwoot_token, chatwoot_url, chatwoot_sign_msg, chatwoot_reopen_conversation, chatwoot_conversation_pending, reject_call, msg_call, groups_ignore, always_online, read_messages, read_status, websocket_enabled, websocket_events, rabbitmq_enabled, rabbitmq_events, typebot_url, typebot, typebot_expire, typebot_keyword_finish, typebot_delay_message, typebot_unknown_message, }: InstanceDto): Promise<{
        instance: {
            instanceName: string;
            status: string;
        };
        hash: {
            jwt: string;
        } | {
            apikey: string;
        };
        webhook: {
            webhook: string;
            webhook_by_events: boolean;
            events: string[];
        };
        websocket: {
            enabled: boolean;
            events: string[];
        };
        rabbitmq: {
            enabled: boolean;
            events: string[];
        };
        typebot: {
            enabled: boolean;
            url: string;
            typebot: string;
            expire: number;
            keyword_finish: string;
            delay_message: number;
            unknown_message: string;
        };
        settings: wa.LocalSettings;
        qrcode: wa.QrCode;
    } | {
        instance: {
            instanceName: string;
            status: string;
        };
        hash: {
            jwt: string;
        } | {
            apikey: string;
        };
        webhook: {
            webhook: string;
            webhook_by_events: boolean;
            events: string[];
        };
        websocket: {
            enabled: boolean;
            events: string[];
        };
        rabbitmq: {
            enabled: boolean;
            events: string[];
        };
        typebot: {
            enabled: boolean;
            url: string;
            typebot: string;
            expire: number;
            keyword_finish: string;
            delay_message: number;
            unknown_message: string;
        };
        settings: wa.LocalSettings;
        chatwoot: {
            enabled: boolean;
            account_id: string;
            token: string;
            url: string;
            sign_msg: boolean;
            reopen_conversation: boolean;
            conversation_pending: boolean;
            number: string;
            name_inbox: string;
            webhook_url: string;
        };
    }>;
    connectToWhatsapp({ instanceName, number }: InstanceDto): Promise<wa.QrCode | {
        instance: {
            instanceName: string;
            state: import("@whiskeysockets/baileys").WAConnectionState | "refused";
        };
    } | {
        instance: {
            instanceName: string;
            status: "refused";
        };
        qrcode: wa.QrCode;
    }>;
    restartInstance({ instanceName }: InstanceDto): Promise<{
        status: string;
        error: boolean;
        response: {
            message: string;
        };
    }>;
    connectionState({ instanceName }: InstanceDto): Promise<{
        instance: {
            instanceName: string;
            state: import("@whiskeysockets/baileys").WAConnectionState | "refused";
        };
    }>;
    fetchInstances({ instanceName }: InstanceDto): Promise<any>;
    logout({ instanceName }: InstanceDto): Promise<{
        status: string;
        error: boolean;
        response: {
            message: string;
        };
    }>;
    deleteInstance({ instanceName }: InstanceDto): Promise<{
        status: string;
        error: boolean;
        response: {
            message: string;
        };
    }>;
    refreshToken(_: InstanceDto, oldToken: OldToken): Promise<{
        jwt: string;
        instanceName: string;
    }>;
}
