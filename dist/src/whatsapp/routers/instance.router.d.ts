import { RequestHandler } from 'express';
import { ConfigService } from '../../config/env.config';
import { RouterBroker } from '../abstract/abstract.router';
export declare class InstanceRouter extends RouterBroker {
    readonly configService: ConfigService;
    constructor(configService: ConfigService, ...guards: RequestHandler[]);
    readonly router: import("express-serve-static-core").Router;
}
