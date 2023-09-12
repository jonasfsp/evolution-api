import EventEmitter2 from 'eventemitter2';
import { ConfigService } from '../../config/env.config';
import { RedisCache } from '../../libs/redis.client';
import { RepositoryBroker } from '../repository/repository.manager';
import { WAStartupService } from './whatsapp.service';
export declare class WAMonitoringService {
    private readonly eventEmitter;
    private readonly configService;
    private readonly repository;
    private readonly cache;
    constructor(eventEmitter: EventEmitter2, configService: ConfigService, repository: RepositoryBroker, cache: RedisCache);
    private readonly db;
    private readonly redis;
    private dbInstance;
    private dbStore;
    private readonly logger;
    readonly waInstances: Record<string, WAStartupService>;
    delInstanceTime(instance: string): void;
    instanceInfo(instanceName?: string): Promise<any>;
    private delInstanceFiles;
    cleaningUp(instanceName: string): Promise<void>;
    cleaningStoreFiles(instanceName: string): Promise<void>;
    loadInstance(): Promise<void>;
    private removeInstance;
    private noConnection;
}
