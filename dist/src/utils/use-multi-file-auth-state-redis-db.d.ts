import { AuthenticationState } from '@whiskeysockets/baileys';
import { RedisCache } from '../libs/redis.client';
export declare function useMultiFileAuthStateRedisDb(cache: RedisCache): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
}>;
