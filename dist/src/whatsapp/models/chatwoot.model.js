"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatwootModel = exports.ChatwootRaw = void 0;
const mongoose_1 = require("mongoose");
const db_connect_1 = require("../../libs/db.connect");
class ChatwootRaw {
}
exports.ChatwootRaw = ChatwootRaw;
const chatwootSchema = new mongoose_1.Schema({
    _id: { type: String, _id: true },
    enabled: { type: Boolean, required: true },
    account_id: { type: String, required: true },
    token: { type: String, required: true },
    url: { type: String, required: true },
    name_inbox: { type: String, required: true },
    sign_msg: { type: Boolean, required: true },
    number: { type: String, required: true },
});
exports.ChatwootModel = db_connect_1.dbserver === null || db_connect_1.dbserver === void 0 ? void 0 : db_connect_1.dbserver.model(ChatwootRaw.name, chatwootSchema, 'chatwoot');
