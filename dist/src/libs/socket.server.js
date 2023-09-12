"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initIO = void 0;
const socket_io_1 = require("socket.io");
const env_config_1 = require("../config/env.config");
const logger_config_1 = require("../config/logger.config");
const logger = new logger_config_1.Logger('Socket');
let io;
const cors = env_config_1.configService.get('CORS').ORIGIN;
const initIO = (httpServer) => {
    if (env_config_1.configService.get('WEBSOCKET').ENABLED) {
        io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: cors,
            },
        });
        io.on('connection', (socket) => {
            logger.info('User connected');
            socket.on('disconnect', () => {
                logger.info('User disconnected');
            });
        });
        logger.info('Socket.io initialized');
        return io;
    }
    return null;
};
exports.initIO = initIO;
const getIO = () => {
    logger.verbose('Getting Socket.io');
    if (!io) {
        logger.error('Socket.io not initialized');
        throw new Error('Socket.io not initialized');
    }
    return io;
};
exports.getIO = getIO;
