import { proto, WAPrivacyOnlineValue, WAPrivacyValue, WAReadReceiptsValue } from '@whiskeysockets/baileys';
export declare class OnWhatsAppDto {
    readonly jid: string;
    readonly exists: boolean;
    readonly name?: string;
    constructor(jid: string, exists: boolean, name?: string);
}
export declare class getBase64FromMediaMessageDto {
    message: proto.WebMessageInfo;
    convertToMp4?: boolean;
}
export declare class WhatsAppNumberDto {
    numbers: string[];
}
export declare class NumberDto {
    number: string;
}
export declare class NumberBusiness {
    wid?: string;
    jid?: string;
    exists?: boolean;
    isBusiness: boolean;
    name?: string;
    message?: string;
    description?: string;
    email?: string;
    website?: string[];
    address?: string;
}
export declare class ProfileNameDto {
    name: string;
}
export declare class ProfileStatusDto {
    status: string;
}
export declare class ProfilePictureDto {
    number?: string;
    picture?: string;
}
declare class Key {
    id: string;
    fromMe: boolean;
    remoteJid: string;
}
export declare class ReadMessageDto {
    read_messages: Key[];
}
export declare class LastMessage {
    key: Key;
    messageTimestamp?: number;
}
export declare class ArchiveChatDto {
    lastMessage?: LastMessage;
    chat?: string;
    archive: boolean;
}
declare class PrivacySetting {
    readreceipts: WAReadReceiptsValue;
    profile: WAPrivacyValue;
    status: WAPrivacyValue;
    online: WAPrivacyOnlineValue;
    last: WAPrivacyValue;
    groupadd: WAPrivacyValue;
}
export declare class PrivacySettingDto {
    privacySettings: PrivacySetting;
}
export declare class DeleteMessage {
    id: string;
    fromMe: boolean;
    remoteJid: string;
    participant?: string;
}
export {};
