"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendReactionDto = exports.SendContactDto = exports.ContactMessage = exports.SendListDto = exports.SendLocationDto = exports.SendButtonDto = exports.SendAudioDto = exports.SendStickerDto = exports.SendMediaDto = exports.MediaMessage = exports.SendPollDto = exports.SendStatusDto = exports.SendTextDto = exports.StatusMessage = exports.Metadata = exports.Options = exports.Mentions = exports.Quoted = void 0;
class Quoted {
}
exports.Quoted = Quoted;
class Mentions {
}
exports.Mentions = Mentions;
class Options {
}
exports.Options = Options;
class OptionsMessage {
}
class Metadata extends OptionsMessage {
}
exports.Metadata = Metadata;
class TextMessage {
}
class StatusMessage {
}
exports.StatusMessage = StatusMessage;
class PollMessage {
}
class SendTextDto extends Metadata {
}
exports.SendTextDto = SendTextDto;
class SendStatusDto extends Metadata {
}
exports.SendStatusDto = SendStatusDto;
class SendPollDto extends Metadata {
}
exports.SendPollDto = SendPollDto;
class MediaMessage {
}
exports.MediaMessage = MediaMessage;
class SendMediaDto extends Metadata {
}
exports.SendMediaDto = SendMediaDto;
class Sticker {
}
class SendStickerDto extends Metadata {
}
exports.SendStickerDto = SendStickerDto;
class Audio {
}
class SendAudioDto extends Metadata {
}
exports.SendAudioDto = SendAudioDto;
class Button {
}
class ButtonMessage {
}
class SendButtonDto extends Metadata {
}
exports.SendButtonDto = SendButtonDto;
class LocationMessage {
}
class SendLocationDto extends Metadata {
}
exports.SendLocationDto = SendLocationDto;
class Row {
}
class Section {
}
class ListMessage {
}
class SendListDto extends Metadata {
}
exports.SendListDto = SendListDto;
class ContactMessage {
}
exports.ContactMessage = ContactMessage;
class SendContactDto extends Metadata {
}
exports.SendContactDto = SendContactDto;
class ReactionMessage {
}
class SendReactionDto {
}
exports.SendReactionDto = SendReactionDto;
