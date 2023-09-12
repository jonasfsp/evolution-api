/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { GroupMetadata, proto, WASocket } from '@whiskeysockets/baileys';
import EventEmitter2 from 'eventemitter2';
import { ConfigService } from '../../config/env.config';
import { RedisCache } from '../../libs/redis.client';
import { ArchiveChatDto, DeleteMessage, getBase64FromMediaMessageDto, LastMessage, NumberBusiness, OnWhatsAppDto, PrivacySettingDto, ReadMessageDto, WhatsAppNumberDto } from '../dto/chat.dto';
import { CreateGroupDto, GetParticipant, GroupDescriptionDto, GroupInvite, GroupJid, GroupPictureDto, GroupSendInvite, GroupSubjectDto, GroupToggleEphemeralDto, GroupUpdateParticipantDto, GroupUpdateSettingDto } from '../dto/group.dto';
import { SendAudioDto, SendButtonDto, SendContactDto, SendListDto, SendLocationDto, SendMediaDto, SendPollDto, SendReactionDto, SendStatusDto, SendStickerDto, SendTextDto } from '../dto/sendMessage.dto';
import { ProxyRaw, RabbitmqRaw, SettingsRaw, TypebotRaw } from '../models';
import { ChatRaw } from '../models/chat.model';
import { ChatwootRaw } from '../models/chatwoot.model';
import { ContactRaw } from '../models/contact.model';
import { MessageRaw, MessageUpdateRaw } from '../models/message.model';
import { WebhookRaw } from '../models/webhook.model';
import { WebsocketRaw } from '../models/websocket.model';
import { ContactQuery } from '../repository/contact.repository';
import { MessageQuery } from '../repository/message.repository';
import { MessageUpQuery } from '../repository/messageUp.repository';
import { RepositoryBroker } from '../repository/repository.manager';
import { Events, wa } from '../types/wa.types';
export declare class WAStartupService {
    private readonly configService;
    private readonly eventEmitter;
    private readonly repository;
    private readonly cache;
    constructor(configService: ConfigService, eventEmitter: EventEmitter2, repository: RepositoryBroker, cache: RedisCache);
    private readonly logger;
    readonly instance: wa.Instance;
    client: WASocket;
    private readonly localWebhook;
    private readonly localChatwoot;
    private readonly localSettings;
    private readonly localWebsocket;
    private readonly localRabbitmq;
    readonly localTypebot: wa.LocalTypebot;
    private readonly localProxy;
    stateConnection: wa.StateConnection;
    readonly storePath: string;
    private readonly msgRetryCounterCache;
    private readonly userDevicesCache;
    private endSession;
    private logBaileys;
    private phoneNumber;
    private chatwootService;
    private typebotService;
    set instanceName(name: string);
    get instanceName(): string;
    get wuid(): string;
    getProfileName(): Promise<string>;
    getProfileStatus(): Promise<string>;
    get profilePictureUrl(): string;
    get qrCode(): wa.QrCode;
    private loadWebhook;
    setWebhook(data: WebhookRaw): Promise<void>;
    findWebhook(): Promise<WebhookRaw>;
    private loadChatwoot;
    setChatwoot(data: ChatwootRaw): Promise<void>;
    findChatwoot(): Promise<ChatwootRaw>;
    private loadSettings;
    setSettings(data: SettingsRaw): Promise<void>;
    findSettings(): Promise<SettingsRaw>;
    private loadWebsocket;
    setWebsocket(data: WebsocketRaw): Promise<void>;
    findWebsocket(): Promise<WebsocketRaw>;
    private loadRabbitmq;
    setRabbitmq(data: RabbitmqRaw): Promise<void>;
    findRabbitmq(): Promise<RabbitmqRaw>;
    private loadTypebot;
    setTypebot(data: TypebotRaw): Promise<void>;
    findTypebot(): Promise<TypebotRaw>;
    private loadProxy;
    setProxy(data: ProxyRaw): Promise<void>;
    findProxy(): Promise<ProxyRaw>;
    sendDataWebhook<T = any>(event: Events, data: T, local?: boolean): Promise<void>;
    private connectionUpdate;
    private getMessage;
    private cleanStore;
    private defineAuthState;
    connectToWhatsapp(number?: string): Promise<WASocket>;
    private readonly chatHandle;
    private readonly contactHandle;
    private readonly messageHandle;
    private readonly groupHandler;
    private eventHandler;
    private formatMXOrARNumber;
    private formatBRNumber;
    private createJid;
    profilePicture(number: string): Promise<{
        wuid: string;
        profilePictureUrl: string;
    }>;
    getStatus(number: string): Promise<{
        wuid: string;
        status: string;
    }>;
    fetchProfile(instanceName: string, number?: string): Promise<{
        wuid: string;
        name: any;
        numberExists: boolean;
        picture: any;
        status: any;
        isBusiness: boolean;
        email: string;
        description: string;
        website: string;
        os?: undefined;
    } | {
        wuid: string;
        name: any;
        picture: any;
        status: any;
        os: any;
        isBusiness: boolean;
        numberExists?: undefined;
        email?: undefined;
        description?: undefined;
        website?: undefined;
    }>;
    private sendMessageWithTyping;
    get connectionStatus(): wa.StateConnection;
    textMessage(data: SendTextDto): Promise<proto.WebMessageInfo>;
    pollMessage(data: SendPollDto): Promise<proto.WebMessageInfo>;
    private formatStatusMessage;
    statusMessage(data: SendStatusDto): Promise<proto.WebMessageInfo>;
    private prepareMediaMessage;
    private convertToWebP;
    mediaSticker(data: SendStickerDto): Promise<proto.WebMessageInfo>;
    mediaMessage(data: SendMediaDto): Promise<proto.WebMessageInfo>;
    private processAudio;
    audioWhatsapp(data: SendAudioDto): Promise<proto.WebMessageInfo>;
    buttonMessage(data: SendButtonDto): Promise<proto.WebMessageInfo>;
    locationMessage(data: SendLocationDto): Promise<proto.WebMessageInfo>;
    listMessage(data: SendListDto): Promise<proto.WebMessageInfo>;
    contactMessage(data: SendContactDto): Promise<proto.WebMessageInfo>;
    reactionMessage(data: SendReactionDto): Promise<proto.WebMessageInfo>;
    whatsappNumber(data: WhatsAppNumberDto): Promise<OnWhatsAppDto[]>;
    markMessageAsRead(data: ReadMessageDto): Promise<{
        message: string;
        read: string;
    }>;
    getLastMessage(number: string): Promise<LastMessage>;
    archiveChat(data: ArchiveChatDto): Promise<{
        chatId: string;
        archived: boolean;
    }>;
    deleteMessage(del: DeleteMessage): Promise<proto.WebMessageInfo>;
    getBase64FromMediaMessage(data: getBase64FromMediaMessageDto): Promise<{
        mediaType: string;
        fileName: any;
        caption: any;
        size: {
            fileLength: any;
            height: any;
            width: any;
        };
        mimetype: any;
        base64: string;
    }>;
    fetchContacts(query: ContactQuery): Promise<ContactRaw[]>;
    fetchMessages(query: MessageQuery): Promise<MessageRaw[]>;
    fetchStatusMessage(query: MessageUpQuery): Promise<MessageUpdateRaw[] | (import("mongoose").Document<unknown, any, MessageUpdateRaw> & Omit<MessageUpdateRaw & Required<{
        _id: string;
    }>, never>)[]>;
    fetchChats(): Promise<ChatRaw[]>;
    fetchPrivacySettings(): Promise<{
        [_: string]: string;
    }>;
    updatePrivacySettings(settings: PrivacySettingDto): Promise<{
        update: string;
        data: {
            readreceipts: import("@whiskeysockets/baileys").WAReadReceiptsValue;
            profile: import("@whiskeysockets/baileys").WAPrivacyValue;
            status: import("@whiskeysockets/baileys").WAPrivacyValue;
            online: import("@whiskeysockets/baileys").WAPrivacyOnlineValue;
            last: import("@whiskeysockets/baileys").WAPrivacyValue;
            groupadd: import("@whiskeysockets/baileys").WAPrivacyValue;
        };
    }>;
    fetchBusinessProfile(number: string): Promise<NumberBusiness>;
    updateProfileName(name: string): Promise<{
        update: string;
    }>;
    updateProfileStatus(status: string): Promise<{
        update: string;
    }>;
    updateProfilePicture(picture: string): Promise<{
        update: string;
    }>;
    removeProfilePicture(): Promise<{
        update: string;
    }>;
    createGroup(create: CreateGroupDto): Promise<GroupMetadata>;
    updateGroupPicture(picture: GroupPictureDto): Promise<{
        update: string;
    }>;
    updateGroupSubject(data: GroupSubjectDto): Promise<{
        update: string;
    }>;
    updateGroupDescription(data: GroupDescriptionDto): Promise<{
        update: string;
    }>;
    findGroup(id: GroupJid, reply?: 'inner' | 'out'): Promise<GroupMetadata>;
    fetchAllGroups(getParticipants: GetParticipant): Promise<{
        id: string;
        subject: string;
        subjectOwner: string;
        subjectTime: number;
        size: number;
        creation: number;
        owner: string;
        desc: string;
        descId: string;
        restrict: boolean;
        announce: boolean;
    }[]>;
    inviteCode(id: GroupJid): Promise<{
        inviteUrl: string;
        inviteCode: string;
    }>;
    inviteInfo(id: GroupInvite): Promise<GroupMetadata>;
    sendInvite(id: GroupSendInvite): Promise<{
        send: boolean;
        inviteUrl: string;
    }>;
    revokeInviteCode(id: GroupJid): Promise<{
        revoked: boolean;
        inviteCode: string;
    }>;
    findParticipants(id: GroupJid): Promise<{
        participants: import("@whiskeysockets/baileys").GroupParticipant[];
    }>;
    updateGParticipant(update: GroupUpdateParticipantDto): Promise<{
        updateParticipants: {
            status: string;
            jid: string;
            content: import("@whiskeysockets/baileys").BinaryNode;
        }[];
    }>;
    updateGSetting(update: GroupUpdateSettingDto): Promise<{
        updateSetting: void;
    }>;
    toggleEphemeral(update: GroupToggleEphemeralDto): Promise<{
        success: boolean;
    }>;
    leaveGroup(id: GroupJid): Promise<{
        groupJid: string;
        leave: boolean;
    }>;
}
