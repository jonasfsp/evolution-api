import { Server } from 'http';
import { Server as SocketIO } from 'socket.io';
export declare const initIO: (httpServer: Server) => SocketIO<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
export declare const getIO: () => SocketIO;
