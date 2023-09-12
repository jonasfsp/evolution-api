import { Redis } from '../config/env.config';
export declare class RedisCache {
    constructor();
    private statusConnection;
    private instanceName;
    private redisEnv;
    set reference(reference: string);
    connect(redisEnv: Redis): Promise<void>;
    private readonly logger;
    private client;
    instanceKeys(): Promise<string[]>;
    keyExists(key?: string): Promise<boolean>;
    writeData(field: string, data: any): Promise<number>;
    readData(field: string): Promise<any>;
    removeData(field: string): Promise<number>;
    delAll(hash?: string): Promise<number>;
}
