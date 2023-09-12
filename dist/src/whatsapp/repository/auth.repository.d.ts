import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { AuthRaw, IAuthModel } from '../models';
export declare class AuthRepository extends Repository {
    private readonly authModel;
    readonly configService: ConfigService;
    constructor(authModel: IAuthModel, configService: ConfigService);
    private readonly auth;
    private readonly logger;
    create(data: AuthRaw, instance: string): Promise<IInsert>;
    find(instance: string): Promise<AuthRaw>;
}
