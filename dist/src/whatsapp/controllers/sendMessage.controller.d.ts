import { InstanceDto } from '../dto/instance.dto';
import { SendAudioDto, SendButtonDto, SendContactDto, SendListDto, SendLocationDto, SendMediaDto, SendPollDto, SendReactionDto, SendStatusDto, SendStickerDto, SendTextDto } from '../dto/sendMessage.dto';
import { WAMonitoringService } from '../services/monitor.service';
export declare class SendMessageController {
    private readonly waMonitor;
    constructor(waMonitor: WAMonitoringService);
    sendText({ instanceName }: InstanceDto, data: SendTextDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendMedia({ instanceName }: InstanceDto, data: SendMediaDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendSticker({ instanceName }: InstanceDto, data: SendStickerDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendWhatsAppAudio({ instanceName }: InstanceDto, data: SendAudioDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendButtons({ instanceName }: InstanceDto, data: SendButtonDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendLocation({ instanceName }: InstanceDto, data: SendLocationDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendList({ instanceName }: InstanceDto, data: SendListDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendContact({ instanceName }: InstanceDto, data: SendContactDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendReaction({ instanceName }: InstanceDto, data: SendReactionDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendPoll({ instanceName }: InstanceDto, data: SendPollDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
    sendStatus({ instanceName }: InstanceDto, data: SendStatusDto): Promise<import("@whiskeysockets/baileys").proto.WebMessageInfo>;
}
