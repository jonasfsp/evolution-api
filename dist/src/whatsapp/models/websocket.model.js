"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketModel = exports.WebsocketRaw = void 0;
const mongoose_1 = require("mongoose");
const db_connect_1 = require("../../libs/db.connect");
class WebsocketRaw {
}
exports.WebsocketRaw = WebsocketRaw;
const websocketSchema = new mongoose_1.Schema({
    _id: { type: String, _id: true },
    enabled: { type: Boolean, required: true },
    events: { type: [String], required: true },
});
exports.WebsocketModel = db_connect_1.dbserver === null || db_connect_1.dbserver === void 0 ? void 0 : db_connect_1.dbserver.model(WebsocketRaw.name, websocketSchema, 'websocket');
