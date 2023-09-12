"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxySchema = exports.typebotStartSchema = exports.typebotStatusSchema = exports.typebotSchema = exports.rabbitmqSchema = exports.websocketSchema = exports.settingsSchema = exports.chatwootSchema = exports.webhookSchema = exports.updateGroupDescriptionSchema = exports.updateGroupSubjectSchema = exports.updateGroupPictureSchema = exports.toggleEphemeralSchema = exports.updateSettingsSchema = exports.updateParticipantsSchema = exports.groupInviteSchema = exports.groupSendInviteSchema = exports.getParticipantsSchema = exports.groupJidSchema = exports.createGroupSchema = exports.messageUpSchema = exports.messageValidateSchema = exports.profileSchema = exports.profilePictureSchema = exports.profileStatusSchema = exports.profileNameSchema = exports.contactValidateSchema = exports.deleteMessageSchema = exports.archiveChatSchema = exports.privacySettingsSchema = exports.readMessageSchema = exports.whatsappNumberSchema = exports.reactionMessageSchema = exports.contactMessageSchema = exports.listMessageSchema = exports.locationMessageSchema = exports.buttonMessageSchema = exports.audioMessageSchema = exports.stickerMessageSchema = exports.mediaMessageSchema = exports.statusMessageSchema = exports.pollMessageSchema = exports.textMessageSchema = exports.oldTokenSchema = exports.instanceNameSchema = void 0;
const uuid_1 = require("uuid");
const isNotEmpty = (...propertyNames) => {
    const properties = {};
    propertyNames.forEach((property) => (properties[property] = {
        minLength: 1,
        description: `The "${property}" cannot be empty`,
    }));
    return {
        if: {
            propertyNames: {
                enum: [...propertyNames],
            },
        },
        then: { properties },
    };
};
exports.instanceNameSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        instanceName: { type: 'string' },
        webhook: { type: 'string' },
        webhook_by_events: { type: 'boolean' },
        events: {
            type: 'array',
            minItems: 0,
            items: {
                type: 'string',
                enum: [
                    'APPLICATION_STARTUP',
                    'QRCODE_UPDATED',
                    'MESSAGES_SET',
                    'MESSAGES_UPSERT',
                    'MESSAGES_UPDATE',
                    'MESSAGES_DELETE',
                    'SEND_MESSAGE',
                    'CONTACTS_SET',
                    'CONTACTS_UPSERT',
                    'CONTACTS_UPDATE',
                    'PRESENCE_UPDATE',
                    'CHATS_SET',
                    'CHATS_UPSERT',
                    'CHATS_UPDATE',
                    'CHATS_DELETE',
                    'GROUPS_UPSERT',
                    'GROUP_UPDATE',
                    'GROUP_PARTICIPANTS_UPDATE',
                    'CONNECTION_UPDATE',
                    'CALL',
                    'NEW_JWT_TOKEN',
                ],
            },
        },
        qrcode: { type: 'boolean', enum: [true, false] },
        number: { type: 'string', pattern: '^\\d+[\\.@\\w-]+' },
        token: { type: 'string' },
    } }, isNotEmpty('instanceName'));
exports.oldTokenSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        oldToken: { type: 'string' },
    }, required: ['oldToken'] }, isNotEmpty('oldToken'));
const quotedOptionsSchema = {
    properties: {
        key: Object.assign({ type: 'object', properties: {
                id: { type: 'string' },
                remoteJid: { type: 'string' },
                fromMe: { type: 'boolean', enum: [true, false] },
            }, required: ['id'] }, isNotEmpty('id')),
        message: { type: 'object' },
    },
};
const mentionsOptionsSchema = {
    properties: {
        everyOne: { type: 'boolean', enum: [true, false] },
        mentioned: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string',
                pattern: '^\\d+',
                description: '"mentioned" must be an array of numeric strings',
            },
        },
    },
};
const optionsSchema = {
    properties: {
        delay: {
            type: 'integer',
            description: 'Enter a value in milliseconds',
        },
        presence: {
            type: 'string',
            enum: ['unavailable', 'available', 'composing', 'recording', 'paused'],
        },
        quoted: Object.assign({}, quotedOptionsSchema),
        mentions: Object.assign({}, mentionsOptionsSchema),
    },
};
const numberDefinition = {
    type: 'string',
    description: 'Invalid format',
};
exports.textMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        textMessage: Object.assign({ type: 'object', properties: {
                text: { type: 'string' },
            }, required: ['text'] }, isNotEmpty('text')),
    },
    required: ['textMessage', 'number'],
};
exports.pollMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        pollMessage: Object.assign({ type: 'object', properties: {
                name: { type: 'string' },
                selectableCount: { type: 'integer', minimum: 0, maximum: 10 },
                values: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 10,
                    uniqueItems: true,
                    items: {
                        type: 'string',
                    },
                },
            }, required: ['name', 'selectableCount', 'values'] }, isNotEmpty('name', 'selectableCount', 'values')),
    },
    required: ['pollMessage', 'number'],
};
exports.statusMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        statusMessage: Object.assign({ type: 'object', properties: {
                type: { type: 'string', enum: ['text', 'image', 'audio', 'video'] },
                content: { type: 'string' },
                caption: { type: 'string' },
                backgroundColor: { type: 'string' },
                font: { type: 'integer', minimum: 0, maximum: 5 },
                statusJidList: {
                    type: 'array',
                    minItems: 1,
                    uniqueItems: true,
                    items: {
                        type: 'string',
                        pattern: '^\\d+',
                        description: '"statusJidList" must be an array of numeric strings',
                    },
                },
                allContacts: { type: 'boolean', enum: [true, false] },
            }, required: ['type', 'content'] }, isNotEmpty('type', 'content')),
    },
    required: ['statusMessage'],
};
exports.mediaMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        mediaMessage: Object.assign({ type: 'object', properties: {
                mediatype: { type: 'string', enum: ['image', 'document', 'video', 'audio'] },
                media: { type: 'string' },
                fileName: { type: 'string' },
                caption: { type: 'string' },
            }, required: ['mediatype', 'media'] }, isNotEmpty('fileName', 'caption', 'media')),
    },
    required: ['mediaMessage', 'number'],
};
exports.stickerMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        stickerMessage: Object.assign({ type: 'object', properties: {
                image: { type: 'string' },
            }, required: ['image'] }, isNotEmpty('image')),
    },
    required: ['stickerMessage', 'number'],
};
exports.audioMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        audioMessage: Object.assign({ type: 'object', properties: {
                audio: { type: 'string' },
            }, required: ['audio'] }, isNotEmpty('audio')),
    },
    required: ['audioMessage', 'number'],
};
exports.buttonMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        buttonMessage: Object.assign({ type: 'object', properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                footerText: { type: 'string' },
                buttons: {
                    type: 'array',
                    minItems: 1,
                    uniqueItems: true,
                    items: Object.assign({ type: 'object', properties: {
                            buttonText: { type: 'string' },
                            buttonId: { type: 'string' },
                        }, required: ['buttonText', 'buttonId'] }, isNotEmpty('buttonText', 'buttonId')),
                },
                mediaMessage: Object.assign({ type: 'object', properties: {
                        media: { type: 'string' },
                        fileName: { type: 'string' },
                        mediatype: { type: 'string', enum: ['image', 'document', 'video'] },
                    }, required: ['media', 'mediatype'] }, isNotEmpty('media', 'fileName')),
            }, required: ['title', 'buttons'] }, isNotEmpty('title', 'description')),
    },
    required: ['number', 'buttonMessage'],
};
exports.locationMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        locationMessage: Object.assign({ type: 'object', properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' },
                name: { type: 'string' },
                address: { type: 'string' },
            }, required: ['latitude', 'longitude'] }, isNotEmpty('name', 'addresss')),
    },
    required: ['number', 'locationMessage'],
};
exports.listMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        listMessage: Object.assign({ type: 'object', properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                footerText: { type: 'string' },
                buttonText: { type: 'string' },
                sections: {
                    type: 'array',
                    minItems: 1,
                    uniqueItems: true,
                    items: Object.assign({ type: 'object', properties: {
                            title: { type: 'string' },
                            rows: {
                                type: 'array',
                                minItems: 1,
                                uniqueItems: true,
                                items: Object.assign({ type: 'object', properties: {
                                        title: { type: 'string' },
                                        description: { type: 'string' },
                                        rowId: { type: 'string' },
                                    }, required: ['title', 'description', 'rowId'] }, isNotEmpty('title', 'description', 'rowId')),
                            },
                        }, required: ['title', 'rows'] }, isNotEmpty('title')),
                },
            }, required: ['title', 'description', 'buttonText', 'sections'] }, isNotEmpty('title', 'description', 'buttonText', 'footerText')),
    },
    required: ['number', 'listMessage'],
};
exports.contactMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: Object.assign({}, numberDefinition),
        options: Object.assign({}, optionsSchema),
        contactMessage: {
            type: 'array',
            items: Object.assign({ type: 'object', properties: {
                    fullName: { type: 'string' },
                    wuid: {
                        type: 'string',
                        minLength: 10,
                        pattern: '\\d+',
                        description: '"wuid" must be a numeric string',
                    },
                    phoneNumber: { type: 'string', minLength: 10 },
                    organization: { type: 'string' },
                    email: { type: 'string' },
                    url: { type: 'string' },
                }, required: ['fullName', 'phoneNumber'] }, isNotEmpty('fullName')),
            minItems: 1,
            uniqueItems: true,
        },
    },
    required: ['number', 'contactMessage'],
};
exports.reactionMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        reactionMessage: Object.assign({ type: 'object', properties: {
                key: Object.assign({ type: 'object', properties: {
                        id: { type: 'string' },
                        remoteJid: { type: 'string' },
                        fromMe: { type: 'boolean', enum: [true, false] },
                    }, required: ['id', 'remoteJid', 'fromMe'] }, isNotEmpty('id', 'remoteJid')),
                reaction: { type: 'string' },
            }, required: ['key', 'reaction'] }, isNotEmpty('reaction')),
    },
    required: ['reactionMessage'],
};
exports.whatsappNumberSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        numbers: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string',
                description: '"numbers" must be an array of numeric strings',
            },
        },
    },
};
exports.readMessageSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        read_messages: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: Object.assign({ properties: {
                    id: { type: 'string' },
                    fromMe: { type: 'boolean', enum: [true, false] },
                    remoteJid: { type: 'string' },
                }, required: ['id', 'fromMe', 'remoteJid'] }, isNotEmpty('id', 'remoteJid')),
        },
    },
    required: ['read_messages'],
};
exports.privacySettingsSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        privacySettings: Object.assign({ type: 'object', properties: {
                readreceipts: { type: 'string', enum: ['all', 'none'] },
                profile: {
                    type: 'string',
                    enum: ['all', 'contacts', 'contact_blacklist', 'none'],
                },
                status: {
                    type: 'string',
                    enum: ['all', 'contacts', 'contact_blacklist', 'none'],
                },
                online: { type: 'string', enum: ['all', 'match_last_seen'] },
                last: { type: 'string', enum: ['all', 'contacts', 'contact_blacklist', 'none'] },
                groupadd: {
                    type: 'string',
                    enum: ['all', 'contacts', 'contact_blacklist', 'none'],
                },
            }, required: ['readreceipts', 'profile', 'status', 'online', 'last', 'groupadd'] }, isNotEmpty('readreceipts', 'profile', 'status', 'online', 'last', 'groupadd')),
    },
    required: ['privacySettings'],
};
exports.archiveChatSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        chat: { type: 'string' },
        lastMessage: Object.assign({ type: 'object', properties: {
                key: Object.assign({ type: 'object', properties: {
                        id: { type: 'string' },
                        remoteJid: { type: 'string' },
                        fromMe: { type: 'boolean', enum: [true, false] },
                    }, required: ['id', 'fromMe', 'remoteJid'] }, isNotEmpty('id', 'remoteJid')),
                messageTimestamp: { type: 'integer', minLength: 1 },
            }, required: ['key'] }, isNotEmpty('messageTimestamp')),
        archive: { type: 'boolean', enum: [true, false] },
    },
    required: ['archive'],
};
exports.deleteMessageSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        id: { type: 'string' },
        fromMe: { type: 'boolean', enum: [true, false] },
        remoteJid: { type: 'string' },
        participant: { type: 'string' },
    }, required: ['id', 'fromMe', 'remoteJid'] }, isNotEmpty('id', 'remoteJid', 'participant'));
exports.contactValidateSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        where: Object.assign({ type: 'object', properties: {
                _id: { type: 'string', minLength: 1 },
                pushName: { type: 'string', minLength: 1 },
                id: { type: 'string', minLength: 1 },
            } }, isNotEmpty('_id', 'id', 'pushName')),
    },
};
exports.profileNameSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        name: { type: 'string' },
    } }, isNotEmpty('name'));
exports.profileStatusSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        status: { type: 'string' },
    } }, isNotEmpty('status'));
exports.profilePictureSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        number: { type: 'string' },
        picture: { type: 'string' },
    },
};
exports.profileSchema = {
    type: 'object',
    properties: {
        wuid: { type: 'string' },
        name: { type: 'string' },
        picture: { type: 'string' },
        status: { type: 'string' },
        isBusiness: { type: 'boolean' },
    },
};
exports.messageValidateSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        where: Object.assign({ type: 'object', properties: {
                _id: { type: 'string', minLength: 1 },
                key: {
                    type: 'object',
                    if: {
                        propertyNames: {
                            enum: ['fromMe', 'remoteJid', 'id'],
                        },
                    },
                    then: {
                        properties: {
                            remoteJid: {
                                type: 'string',
                                minLength: 1,
                                description: 'The property cannot be empty',
                            },
                            id: {
                                type: 'string',
                                minLength: 1,
                                description: 'The property cannot be empty',
                            },
                            fromMe: { type: 'boolean', enum: [true, false] },
                        },
                    },
                },
                message: { type: 'object' },
            } }, isNotEmpty('_id')),
        limit: { type: 'integer' },
    },
};
exports.messageUpSchema = {
    $id: (0, uuid_1.v4)(),
    type: 'object',
    properties: {
        where: Object.assign({ type: 'object', properties: {
                _id: { type: 'string' },
                remoteJid: { type: 'string' },
                id: { type: 'string' },
                fromMe: { type: 'boolean', enum: [true, false] },
                participant: { type: 'string' },
                status: {
                    type: 'string',
                    enum: ['ERROR', 'PENDING', 'SERVER_ACK', 'DELIVERY_ACK', 'READ', 'PLAYED'],
                },
            } }, isNotEmpty('_id', 'remoteJid', 'id', 'status')),
        limit: { type: 'integer' },
    },
};
exports.createGroupSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        subject: { type: 'string' },
        description: { type: 'string' },
        profilePicture: { type: 'string' },
        promoteParticipants: { type: 'boolean', enum: [true, false] },
        participants: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string',
                minLength: 10,
                pattern: '\\d+',
                description: '"participants" must be an array of numeric strings',
            },
        },
    }, required: ['subject', 'participants'] }, isNotEmpty('subject', 'description', 'profilePicture'));
exports.groupJidSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string', pattern: '^[\\d-]+@g.us$' },
    }, required: ['groupJid'] }, isNotEmpty('groupJid'));
exports.getParticipantsSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        getParticipants: { type: 'string', enum: ['true', 'false'] },
    }, required: ['getParticipants'] }, isNotEmpty('getParticipants'));
exports.groupSendInviteSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string' },
        description: { type: 'string' },
        numbers: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string',
                minLength: 10,
                pattern: '\\d+',
                description: '"numbers" must be an array of numeric strings',
            },
        },
    }, required: ['groupJid', 'description', 'numbers'] }, isNotEmpty('groupJid', 'description', 'numbers'));
exports.groupInviteSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        inviteCode: { type: 'string', pattern: '^[a-zA-Z0-9]{22}$' },
    }, required: ['inviteCode'] }, isNotEmpty('inviteCode'));
exports.updateParticipantsSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string' },
        action: {
            type: 'string',
            enum: ['add', 'remove', 'promote', 'demote'],
        },
        participants: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string',
                minLength: 10,
                pattern: '\\d+',
                description: '"participants" must be an array of numeric strings',
            },
        },
    }, required: ['groupJid', 'action', 'participants'] }, isNotEmpty('groupJid', 'action'));
exports.updateSettingsSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string' },
        action: {
            type: 'string',
            enum: ['announcement', 'not_announcement', 'locked', 'unlocked'],
        },
    }, required: ['groupJid', 'action'] }, isNotEmpty('groupJid', 'action'));
exports.toggleEphemeralSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string' },
        expiration: {
            type: 'number',
            enum: [0, 86400, 604800, 7776000],
        },
    }, required: ['groupJid', 'expiration'] }, isNotEmpty('groupJid', 'expiration'));
exports.updateGroupPictureSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string' },
        image: { type: 'string' },
    }, required: ['groupJid', 'image'] }, isNotEmpty('groupJid', 'image'));
exports.updateGroupSubjectSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string' },
        subject: { type: 'string' },
    }, required: ['groupJid', 'subject'] }, isNotEmpty('groupJid', 'subject'));
exports.updateGroupDescriptionSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        groupJid: { type: 'string' },
        description: { type: 'string' },
    }, required: ['groupJid', 'description'] }, isNotEmpty('groupJid', 'description'));
exports.webhookSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        url: { type: 'string' },
        events: {
            type: 'array',
            minItems: 0,
            items: {
                type: 'string',
                enum: [
                    'APPLICATION_STARTUP',
                    'QRCODE_UPDATED',
                    'MESSAGES_SET',
                    'MESSAGES_UPSERT',
                    'MESSAGES_UPDATE',
                    'MESSAGES_DELETE',
                    'SEND_MESSAGE',
                    'CONTACTS_SET',
                    'CONTACTS_UPSERT',
                    'CONTACTS_UPDATE',
                    'PRESENCE_UPDATE',
                    'CHATS_SET',
                    'CHATS_UPSERT',
                    'CHATS_UPDATE',
                    'CHATS_DELETE',
                    'GROUPS_UPSERT',
                    'GROUP_UPDATE',
                    'GROUP_PARTICIPANTS_UPDATE',
                    'CONNECTION_UPDATE',
                    'CALL',
                    'NEW_JWT_TOKEN',
                ],
            },
        },
    }, required: ['url'] }, isNotEmpty('url'));
exports.chatwootSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        enabled: { type: 'boolean', enum: [true, false] },
        account_id: { type: 'string' },
        token: { type: 'string' },
        url: { type: 'string' },
        sign_msg: { type: 'boolean', enum: [true, false] },
        reopen_conversation: { type: 'boolean', enum: [true, false] },
        conversation_pending: { type: 'boolean', enum: [true, false] },
    }, required: ['enabled', 'account_id', 'token', 'url', 'sign_msg', 'reopen_conversation', 'conversation_pending'] }, isNotEmpty('account_id', 'token', 'url', 'sign_msg', 'reopen_conversation', 'conversation_pending'));
exports.settingsSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        reject_call: { type: 'boolean', enum: [true, false] },
        msg_call: { type: 'string' },
        groups_ignore: { type: 'boolean', enum: [true, false] },
        always_online: { type: 'boolean', enum: [true, false] },
        read_messages: { type: 'boolean', enum: [true, false] },
        read_status: { type: 'boolean', enum: [true, false] },
    }, required: ['reject_call', 'groups_ignore', 'always_online', 'read_messages', 'read_status'] }, isNotEmpty('reject_call', 'groups_ignore', 'always_online', 'read_messages', 'read_status'));
exports.websocketSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        enabled: { type: 'boolean', enum: [true, false] },
        events: {
            type: 'array',
            minItems: 0,
            items: {
                type: 'string',
                enum: [
                    'APPLICATION_STARTUP',
                    'QRCODE_UPDATED',
                    'MESSAGES_SET',
                    'MESSAGES_UPSERT',
                    'MESSAGES_UPDATE',
                    'MESSAGES_DELETE',
                    'SEND_MESSAGE',
                    'CONTACTS_SET',
                    'CONTACTS_UPSERT',
                    'CONTACTS_UPDATE',
                    'PRESENCE_UPDATE',
                    'CHATS_SET',
                    'CHATS_UPSERT',
                    'CHATS_UPDATE',
                    'CHATS_DELETE',
                    'GROUPS_UPSERT',
                    'GROUP_UPDATE',
                    'GROUP_PARTICIPANTS_UPDATE',
                    'CONNECTION_UPDATE',
                    'CALL',
                    'NEW_JWT_TOKEN',
                ],
            },
        },
    }, required: ['enabled'] }, isNotEmpty('enabled'));
exports.rabbitmqSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        enabled: { type: 'boolean', enum: [true, false] },
        events: {
            type: 'array',
            minItems: 0,
            items: {
                type: 'string',
                enum: [
                    'APPLICATION_STARTUP',
                    'QRCODE_UPDATED',
                    'MESSAGES_SET',
                    'MESSAGES_UPSERT',
                    'MESSAGES_UPDATE',
                    'MESSAGES_DELETE',
                    'SEND_MESSAGE',
                    'CONTACTS_SET',
                    'CONTACTS_UPSERT',
                    'CONTACTS_UPDATE',
                    'PRESENCE_UPDATE',
                    'CHATS_SET',
                    'CHATS_UPSERT',
                    'CHATS_UPDATE',
                    'CHATS_DELETE',
                    'GROUPS_UPSERT',
                    'GROUP_UPDATE',
                    'GROUP_PARTICIPANTS_UPDATE',
                    'CONNECTION_UPDATE',
                    'CALL',
                    'NEW_JWT_TOKEN',
                ],
            },
        },
    }, required: ['enabled'] }, isNotEmpty('enabled'));
exports.typebotSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        enabled: { type: 'boolean', enum: [true, false] },
        url: { type: 'string' },
        typebot: { type: 'string' },
        expire: { type: 'integer' },
        delay_message: { type: 'integer' },
        unknown_message: { type: 'string' },
    }, required: ['enabled', 'url', 'typebot', 'expire'] }, isNotEmpty('enabled', 'url', 'typebot', 'expire'));
exports.typebotStatusSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        remoteJid: { type: 'string' },
        status: { type: 'string', enum: ['opened', 'closed', 'paused'] },
    }, required: ['remoteJid', 'status'] }, isNotEmpty('remoteJid', 'status'));
exports.typebotStartSchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        remoteJid: { type: 'string' },
        url: { type: 'string' },
        typebot: { type: 'string' },
    }, required: ['remoteJid', 'url', 'typebot'] }, isNotEmpty('remoteJid', 'url', 'typebot'));
exports.proxySchema = Object.assign({ $id: (0, uuid_1.v4)(), type: 'object', properties: {
        enabled: { type: 'boolean', enum: [true, false] },
        proxy: { type: 'string' },
    }, required: ['enabled', 'proxy'] }, isNotEmpty('enabled', 'proxy'));
