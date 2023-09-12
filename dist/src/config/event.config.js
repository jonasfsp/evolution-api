"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const eventemitter2_1 = __importDefault(require("eventemitter2"));
exports.eventEmitter = new eventemitter2_1.default({
    delimiter: '.',
    newListener: false,
    ignoreErrors: false,
});
