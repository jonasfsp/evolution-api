"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypebotModel = exports.TypebotRaw = void 0;
const mongoose_1 = require("mongoose");
const db_connect_1 = require("../../libs/db.connect");
class Session {
}
class TypebotRaw {
}
exports.TypebotRaw = TypebotRaw;
const typebotSchema = new mongoose_1.Schema({
    _id: { type: String, _id: true },
    enabled: { type: Boolean, required: true },
    url: { type: String, required: true },
    typebot: { type: String, required: true },
    expire: { type: Number, required: true },
    keyword_finish: { type: String, required: true },
    delay_message: { type: Number, required: true },
    unknown_message: { type: String, required: true },
    sessions: [
        {
            remoteJid: { type: String, required: true },
            sessionId: { type: String, required: true },
            status: { type: String, required: true },
            createdAt: { type: Number, required: true },
            updateAt: { type: Number, required: true },
        },
    ],
});
exports.TypebotModel = db_connect_1.dbserver === null || db_connect_1.dbserver === void 0 ? void 0 : db_connect_1.dbserver.model(TypebotRaw.name, typebotSchema, 'typebot');
