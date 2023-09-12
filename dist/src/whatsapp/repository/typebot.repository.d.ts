import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { ITypebotModel, TypebotRaw } from '../models';
export declare class TypebotRepository extends Repository {
    private readonly typebotModel;
    private readonly configService;
    constructor(typebotModel: ITypebotModel, configService: ConfigService);
    private readonly logger;
    create(data: TypebotRaw, instance: string): Promise<IInsert>;
    find(instance: string): Promise<TypebotRaw>;
}
