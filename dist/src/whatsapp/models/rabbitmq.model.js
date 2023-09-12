"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqModel = exports.RabbitmqRaw = void 0;
const mongoose_1 = require("mongoose");
const db_connect_1 = require("../../libs/db.connect");
class RabbitmqRaw {
}
exports.RabbitmqRaw = RabbitmqRaw;
const rabbitmqSchema = new mongoose_1.Schema({
    _id: { type: String, _id: true },
    enabled: { type: Boolean, required: true },
    events: { type: [String], required: true },
});
exports.RabbitmqModel = db_connect_1.dbserver === null || db_connect_1.dbserver === void 0 ? void 0 : db_connect_1.dbserver.model(RabbitmqRaw.name, rabbitmqSchema, 'rabbitmq');
