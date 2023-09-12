"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const logger_config_1 = require("../../config/logger.config");
const logger = new logger_config_1.Logger('ChatController');
class GroupController {
    constructor(waMonitor) {
        this.waMonitor = waMonitor;
    }
    createGroup(instance, create) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested createGroup from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].createGroup(create);
        });
    }
    updateGroupPicture(instance, update) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateGroupPicture from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].updateGroupPicture(update);
        });
    }
    updateGroupSubject(instance, update) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateGroupSubject from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].updateGroupSubject(update);
        });
    }
    updateGroupDescription(instance, update) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateGroupDescription from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].updateGroupDescription(update);
        });
    }
    findGroupInfo(instance, groupJid) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findGroupInfo from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].findGroup(groupJid);
        });
    }
    fetchAllGroups(instance, getPaticipants) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested fetchAllGroups from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].fetchAllGroups(getPaticipants);
        });
    }
    inviteCode(instance, groupJid) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested inviteCode from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].inviteCode(groupJid);
        });
    }
    inviteInfo(instance, inviteCode) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested inviteInfo from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].inviteInfo(inviteCode);
        });
    }
    sendInvite(instance, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested sendInvite from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].sendInvite(data);
        });
    }
    revokeInviteCode(instance, groupJid) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested revokeInviteCode from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].revokeInviteCode(groupJid);
        });
    }
    findParticipants(instance, groupJid) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested findParticipants from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].findParticipants(groupJid);
        });
    }
    updateGParticipate(instance, update) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateGParticipate from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].updateGParticipant(update);
        });
    }
    updateGSetting(instance, update) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested updateGSetting from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].updateGSetting(update);
        });
    }
    toggleEphemeral(instance, update) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested toggleEphemeral from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].toggleEphemeral(update);
        });
    }
    leaveGroup(instance, groupJid) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.verbose('requested leaveGroup from ' + instance.instanceName + ' instance');
            return yield this.waMonitor.waInstances[instance.instanceName].leaveGroup(groupJid);
        });
    }
}
exports.GroupController = GroupController;
