import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { IWebsocketModel, WebsocketRaw } from '../models';
export declare class WebsocketRepository extends Repository {
    private readonly websocketModel;
    private readonly configService;
    constructor(websocketModel: IWebsocketModel, configService: ConfigService);
    private readonly logger;
    create(data: WebsocketRaw, instance: string): Promise<IInsert>;
    find(instance: string): Promise<WebsocketRaw>;
}
