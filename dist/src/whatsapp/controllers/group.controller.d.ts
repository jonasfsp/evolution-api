import { CreateGroupDto, GetParticipant, GroupDescriptionDto, GroupInvite, GroupJid, GroupPictureDto, GroupSendInvite, GroupSubjectDto, GroupToggleEphemeralDto, GroupUpdateParticipantDto, GroupUpdateSettingDto } from '../dto/group.dto';
import { InstanceDto } from '../dto/instance.dto';
import { WAMonitoringService } from '../services/monitor.service';
export declare class GroupController {
    private readonly waMonitor;
    constructor(waMonitor: WAMonitoringService);
    createGroup(instance: InstanceDto, create: CreateGroupDto): Promise<import("@whiskeysockets/baileys").GroupMetadata>;
    updateGroupPicture(instance: InstanceDto, update: GroupPictureDto): Promise<{
        update: string;
    }>;
    updateGroupSubject(instance: InstanceDto, update: GroupSubjectDto): Promise<{
        update: string;
    }>;
    updateGroupDescription(instance: InstanceDto, update: GroupDescriptionDto): Promise<{
        update: string;
    }>;
    findGroupInfo(instance: InstanceDto, groupJid: GroupJid): Promise<import("@whiskeysockets/baileys").GroupMetadata>;
    fetchAllGroups(instance: InstanceDto, getPaticipants: GetParticipant): Promise<{
        id: string;
        subject: string;
        subjectOwner: string;
        subjectTime: number;
        size: number;
        creation: number;
        owner: string;
        desc: string;
        descId: string;
        restrict: boolean;
        announce: boolean;
    }[]>;
    inviteCode(instance: InstanceDto, groupJid: GroupJid): Promise<{
        inviteUrl: string;
        inviteCode: string;
    }>;
    inviteInfo(instance: InstanceDto, inviteCode: GroupInvite): Promise<import("@whiskeysockets/baileys").GroupMetadata>;
    sendInvite(instance: InstanceDto, data: GroupSendInvite): Promise<{
        send: boolean;
        inviteUrl: string;
    }>;
    revokeInviteCode(instance: InstanceDto, groupJid: GroupJid): Promise<{
        revoked: boolean;
        inviteCode: string;
    }>;
    findParticipants(instance: InstanceDto, groupJid: GroupJid): Promise<{
        participants: import("@whiskeysockets/baileys").GroupParticipant[];
    }>;
    updateGParticipate(instance: InstanceDto, update: GroupUpdateParticipantDto): Promise<{
        updateParticipants: {
            status: string;
            jid: string;
            content: import("@whiskeysockets/baileys").BinaryNode;
        }[];
    }>;
    updateGSetting(instance: InstanceDto, update: GroupUpdateSettingDto): Promise<{
        updateSetting: void;
    }>;
    toggleEphemeral(instance: InstanceDto, update: GroupToggleEphemeralDto): Promise<{
        success: boolean;
    }>;
    leaveGroup(instance: InstanceDto, groupJid: GroupJid): Promise<{
        groupJid: string;
        leave: boolean;
    }>;
}
