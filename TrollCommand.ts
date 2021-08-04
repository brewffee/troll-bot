import { DiscordAPIError, GuildChannel, GuildMember, Message, PermissionResolvable, Role, ThreadChannel, User } from 'discord.js';
import { TrollClient } from './TrollClient';

interface CommandOptions {
  name: string;
  description: string;
  aliases?: string[];
  argCount?: [number, string];
  usage: string;
  nsfw?: boolean;
  permissions?: {
    client?: PermissionResolvable[];
    user?: PermissionResolvable[];
  };
  accessibility?: {
    guildOnly?: boolean;
    owner?: boolean;
    admins?: boolean;
    mods?: boolean;
  };
  arguments?: Argument[];
  run: (message: Message, args: any, flags: Map<string, string>) => Promise<Result | undefined>;
}

export class TrollCommand {
  public info: CommandOptions;
  public isAuthorized: Function;
  public run: Function;
  constructor(client: TrollClient, info: CommandOptions) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false });
    this.info = info;
    this.info.arguments = info.arguments?.map((argument) => ({ required: true, ...argument })) ?? [];
    this.run = info.run;
    this.isAuthorized = ({ member, guild }: Message): boolean => {
      let authorized: boolean = false;
      if (!this.info.accessibility) {
        authorized = true;
      } else if (this.info.accessibility.owner) {
        authorized = member!.id === guild!.ownerId;
      } else if (this.info.accessibility.admins) {
        authorized = member!.roles.cache.some((r) => r.id === '842802299675213824') || member!.id === guild!.ownerId;
      } else if (this.info.accessibility.mods) {
        authorized = member!.roles.cache.some((r) => ['842802299675213824', '842802567499219005'].includes(r.id)) || member!.id === guild!.ownerId;
      }

      if (authorized && this.info.permissions) {
        authorized = member!.permissions.has(this.info.permissions!.user!, true);
      }

      return authorized;
    };
  }
}

export interface Result {
  code: string;
  details?: string;
  error?: Error | DiscordAPIError;
}

export interface Argument {
  name: string;
  required?: boolean;
  type: 'STRING' | 'NUMBER' | 'MEMBER' | 'USER' | 'CHANNEL' | 'ROLE';
}

export interface Flag {}

export type ArgumentType = string | number | null | undefined | GuildMember | User | GuildChannel | ThreadChannel | Role;
