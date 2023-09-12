"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyModel = exports.ProxyRaw = void 0;
const mongoose_1 = require("mongoose");
const db_connect_1 = require("../../libs/db.connect");
class ProxyRaw {
}
exports.ProxyRaw = ProxyRaw;
const proxySchema = new mongoose_1.Schema({
    _id: { type: String, _id: true },
    enabled: { type: Boolean, required: true },
    proxy: { type: String, required: true },
});
exports.ProxyModel = db_connect_1.dbserver === null || db_connect_1.dbserver === void 0 ? void 0 : db_connect_1.dbserver.model(ProxyRaw.name, proxySchema, 'proxy');
