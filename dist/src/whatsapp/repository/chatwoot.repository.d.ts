import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { ChatwootRaw, IChatwootModel } from '../models';
export declare class ChatwootRepository extends Repository {
    private readonly chatwootModel;
    private readonly configService;
    constructor(chatwootModel: IChatwootModel, configService: ConfigService);
    private readonly logger;
    create(data: ChatwootRaw, instance: string): Promise<IInsert>;
    find(instance: string): Promise<ChatwootRaw>;
}
