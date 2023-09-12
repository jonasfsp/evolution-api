import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { IRabbitmqModel, RabbitmqRaw } from '../models';
export declare class RabbitmqRepository extends Repository {
    private readonly rabbitmqModel;
    private readonly configService;
    constructor(rabbitmqModel: IRabbitmqModel, configService: ConfigService);
    private readonly logger;
    create(data: RabbitmqRaw, instance: string): Promise<IInsert>;
    find(instance: string): Promise<RabbitmqRaw>;
}
