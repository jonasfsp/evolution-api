import { ConfigService } from '../../config/env.config';
import { ChatwootDto } from '../dto/chatwoot.dto';
import { InstanceDto } from '../dto/instance.dto';
import { ChatwootService } from '../services/chatwoot.service';
export declare class ChatwootController {
    private readonly chatwootService;
    private readonly configService;
    constructor(chatwootService: ChatwootService, configService: ConfigService);
    createChatwoot(instance: InstanceDto, data: ChatwootDto): Promise<{
        webhook_url: string;
        enabled?: boolean;
        account_id?: string;
        token?: string;
        url?: string;
        name_inbox?: string;
        sign_msg?: boolean;
        number?: string;
        reopen_conversation?: boolean;
        conversation_pending?: boolean;
    }>;
    findChatwoot(instance: InstanceDto): Promise<{
        webhook_url: string;
        enabled?: boolean;
        account_id?: string;
        token?: string;
        url?: string;
        name_inbox?: string;
        sign_msg?: boolean;
        number?: string;
        reopen_conversation?: boolean;
        conversation_pending?: boolean;
    }>;
    receiveWebhook(instance: InstanceDto, data: any): Promise<{
        message: string;
    }>;
}
