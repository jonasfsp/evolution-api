"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAMQP = exports.initAMQP = void 0;
const amqp = __importStar(require("amqplib/callback_api"));
const env_config_1 = require("../config/env.config");
const logger_config_1 = require("../config/logger.config");
const logger = new logger_config_1.Logger('AMQP');
let amqpChannel = null;
const initAMQP = () => {
    return new Promise((resolve, reject) => {
        const uri = env_config_1.configService.get('RABBITMQ').URI;
        amqp.connect(uri, (error, connection) => {
            if (error) {
                reject(error);
                return;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    reject(channelError);
                    return;
                }
                const exchangeName = 'evolution_exchange';
                channel.assertExchange(exchangeName, 'topic', {
                    durable: true,
                    autoDelete: false,
                });
                amqpChannel = channel;
                logger.info('AMQP initialized');
                resolve();
            });
        });
    });
};
exports.initAMQP = initAMQP;
const getAMQP = () => {
    return amqpChannel;
};
exports.getAMQP = getAMQP;
