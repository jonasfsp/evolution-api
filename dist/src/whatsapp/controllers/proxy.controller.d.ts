import { InstanceDto } from '../dto/instance.dto';
import { ProxyDto } from '../dto/proxy.dto';
import { ProxyService } from '../services/proxy.service';
export declare class ProxyController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    createProxy(instance: InstanceDto, data: ProxyDto): Promise<{
        proxy: {
            proxy: ProxyDto;
            instanceName: string;
            qrcode?: boolean;
            number?: string;
            token?: string;
            webhook?: string;
            webhook_by_events?: boolean;
            events?: string[];
            reject_call?: boolean;
            msg_call?: string;
            groups_ignore?: boolean;
            always_online?: boolean;
            read_messages?: boolean;
            read_status?: boolean;
            chatwoot_account_id?: string;
            chatwoot_token?: string;
            chatwoot_url?: string;
            chatwoot_sign_msg?: boolean;
            chatwoot_reopen_conversation?: boolean;
            chatwoot_conversation_pending?: boolean;
            websocket_enabled?: boolean;
            websocket_events?: string[];
            rabbitmq_enabled?: boolean;
            rabbitmq_events?: string[];
            typebot_url?: string;
            typebot?: string;
            typebot_expire?: number;
            typebot_keyword_finish?: string;
            typebot_delay_message?: number;
            typebot_unknown_message?: string;
            proxy_enabled?: boolean;
            proxy_proxy?: string;
        };
    }>;
    findProxy(instance: InstanceDto): Promise<import("../models").ProxyRaw>;
}
