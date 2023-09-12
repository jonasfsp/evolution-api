/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { ConfigService } from '../../config/env.config';
import { IInsert, Repository } from '../abstract/abstract.repository';
import { IMessageUpModel, MessageUpdateRaw } from '../models';
export declare class MessageUpQuery {
    where: MessageUpdateRaw;
    limit?: number;
}
export declare class MessageUpRepository extends Repository {
    private readonly messageUpModel;
    private readonly configService;
    constructor(messageUpModel: IMessageUpModel, configService: ConfigService);
    private readonly logger;
    insert(data: MessageUpdateRaw[], instanceName: string, saveDb?: boolean): Promise<IInsert>;
    find(query: MessageUpQuery): Promise<MessageUpdateRaw[] | (import("mongoose").Document<unknown, any, MessageUpdateRaw> & Omit<MessageUpdateRaw & Required<{
        _id: string;
    }>, never>)[]>;
}
