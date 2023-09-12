"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = exports.SettingsRaw = void 0;
const mongoose_1 = require("mongoose");
const db_connect_1 = require("../../libs/db.connect");
class SettingsRaw {
}
exports.SettingsRaw = SettingsRaw;
const settingsSchema = new mongoose_1.Schema({
    _id: { type: String, _id: true },
    reject_call: { type: Boolean, required: true },
    msg_call: { type: String, required: true },
    groups_ignore: { type: Boolean, required: true },
    always_online: { type: Boolean, required: true },
    read_messages: { type: Boolean, required: true },
    read_status: { type: Boolean, required: true },
});
exports.SettingsModel = db_connect_1.dbserver === null || db_connect_1.dbserver === void 0 ? void 0 : db_connect_1.dbserver.model(SettingsRaw.name, settingsSchema, 'settings');
