import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { IMessageModel, MessageRaw } from '../models';
export declare class MessageQuery {
    where: MessageRaw;
    limit?: number;
}
export declare class MessageRepository extends Repository {
    private readonly messageModel;
    private readonly configService;
    constructor(messageModel: IMessageModel, configService: ConfigService);
    private readonly logger;
    insert(data: MessageRaw[], instanceName: string, saveDb?: boolean): Promise<IInsert>;
    find(query: MessageQuery): Promise<MessageRaw[]>;
}
