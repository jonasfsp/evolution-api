import { AuthenticationState } from '@whiskeysockets/baileys';
export declare function useMultiFileAuthStateDb(coll: string): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
}>;
