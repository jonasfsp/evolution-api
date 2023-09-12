import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { ISettingsModel, SettingsRaw } from '../models';
export declare class SettingsRepository extends Repository {
    private readonly settingsModel;
    private readonly configService;
    constructor(settingsModel: ISettingsModel, configService: ConfigService);
    private readonly logger;
    create(data: SettingsRaw, instance: string): Promise<IInsert>;
    find(instance: string): Promise<SettingsRaw>;
}
