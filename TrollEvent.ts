import { Emoji, EmojiResolvable, Guild, GuildEmoji, Message, MessageAttachment, MessageOptions, PermissionResolvable, Permissions, ReactionEmoji } from 'discord.js';
import { TrollClient } from './TrollClient';

interface EventOptions {
  name: string;
  description: string;
  type: string;
  run: Function;
}
interface ResponseOptions extends EventOptions {
  name: string;
  description: string;
  responder: {
    type: ['reaction'] | ['message', 'attatchment'?];
    variants: EmojiResolvable[] | [string[], MessageAttachment[]?];
    regex: RegExp;
  };
}

export class TrollEvent {
  public info: EventOptions;
  constructor(client: TrollClient, info: EventOptions) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false });
    this.info = info;
  }
}

export class TrollResponse {
  public info: ResponseOptions;
  constructor(client: TrollClient, info: ResponseOptions) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false });
    this.info = info;
  }
}
