import 'express-async-errors';
import { Request } from 'express';
import { JSONSchema7 } from 'json-schema';
import { InstanceDto } from '../dto/instance.dto';
type DataValidate<T> = {
    request: Request;
    schema: JSONSchema7;
    ClassRef: any;
    execute: (instance: InstanceDto, data: T) => Promise<any>;
};
export declare abstract class RouterBroker {
    constructor();
    routerPath(path: string, param?: boolean): string;
    dataValidate<T>(args: DataValidate<T>): Promise<any>;
    groupNoValidate<T>(args: DataValidate<T>): Promise<any>;
    groupValidate<T>(args: DataValidate<T>): Promise<any>;
    inviteCodeValidate<T>(args: DataValidate<T>): Promise<any>;
    getParticipantsValidate<T>(args: DataValidate<T>): Promise<any>;
}
export {};
