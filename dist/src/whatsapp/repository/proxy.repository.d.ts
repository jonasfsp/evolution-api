import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { IProxyModel, ProxyRaw } from '../models';
export declare class ProxyRepository extends Repository {
    private readonly proxyModel;
    private readonly configService;
    constructor(proxyModel: IProxyModel, configService: ConfigService);
    private readonly logger;
    create(data: ProxyRaw, instance: string): Promise<IInsert>;
    find(instance: string): Promise<ProxyRaw>;
}
