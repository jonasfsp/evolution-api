import { ConfigService } from '../../config/env.config';
import { ChatwootDto } from '../dto/chatwoot.dto';
import { InstanceDto } from '../dto/instance.dto';
import { WAMonitoringService } from './monitor.service';
export declare class ChatwootService {
    private readonly waMonitor;
    private readonly configService;
    private messageCacheFile;
    private messageCache;
    private readonly logger;
    private provider;
    constructor(waMonitor: WAMonitoringService, configService: ConfigService);
    private loadMessageCache;
    private saveMessageCache;
    private clearMessageCache;
    private getProvider;
    private clientCw;
    create(instance: InstanceDto, data: ChatwootDto): ChatwootDto;
    find(instance: InstanceDto): Promise<ChatwootDto>;
    getContact(instance: InstanceDto, id: number): Promise<import("@figuro/chatwoot-sdk").contactable_inboxes>;
    initInstanceChatwoot(instance: InstanceDto, inboxName: string, webhookUrl: string, qrcode: boolean, number: string): Promise<boolean>;
    createContact(instance: InstanceDto, phoneNumber: string, inboxId: number, isGroup: boolean, name?: string, avatar_url?: string, jid?: string): Promise<import("@figuro/chatwoot-sdk").extended_contact>;
    updateContact(instance: InstanceDto, id: number, data: any): Promise<void>;
    findContact(instance: InstanceDto, phoneNumber: string): Promise<any>;
    createConversation(instance: InstanceDto, body: any): Promise<any>;
    getInbox(instance: InstanceDto): Promise<any>;
    createMessage(instance: InstanceDto, conversationId: number, content: string, messageType: 'incoming' | 'outgoing' | undefined, privateMessage?: boolean, attachments?: {
        content: unknown;
        encoding: string;
        filename: string;
    }[]): Promise<import("@figuro/chatwoot-sdk").generic_id & import("@figuro/chatwoot-sdk").message>;
    createBotMessage(instance: InstanceDto, content: string, messageType: 'incoming' | 'outgoing' | undefined, attachments?: {
        content: unknown;
        encoding: string;
        filename: string;
    }[]): Promise<import("@figuro/chatwoot-sdk").generic_id & import("@figuro/chatwoot-sdk").message>;
    private sendData;
    createBotQr(instance: InstanceDto, content: string, messageType: 'incoming' | 'outgoing' | undefined, file?: string): Promise<any>;
    sendAttachment(waInstance: any, number: string, media: any, caption?: string): Promise<void>;
    receiveWebhook(instance: InstanceDto, body: any): Promise<{
        message: string;
    }>;
    private isMediaMessage;
    private getTypeMessage;
    private getMessageContent;
    private getConversationMessage;
    eventWhatsapp(event: string, instance: InstanceDto, body: any): Promise<any>;
}
