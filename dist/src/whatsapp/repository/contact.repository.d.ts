import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { ContactRaw, IContactModel } from '../models';
export declare class ContactQuery {
    where: ContactRaw;
}
export declare class ContactRepository extends Repository {
    private readonly contactModel;
    private readonly configService;
    constructor(contactModel: IContactModel, configService: ConfigService);
    private readonly logger;
    insert(data: ContactRaw[], instanceName: string, saveDb?: boolean): Promise<IInsert>;
    update(data: ContactRaw[], instanceName: string, saveDb?: boolean): Promise<IInsert>;
    find(query: ContactQuery): Promise<ContactRaw[]>;
}
