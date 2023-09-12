import * as amqp from 'amqplib/callback_api';
export declare const initAMQP: () => Promise<void>;
export declare const getAMQP: () => amqp.Channel | null;
