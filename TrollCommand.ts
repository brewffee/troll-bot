import * as Discord from 'discord.js';
import { TrollClient } from './TrollClient';

interface CommandOptions {
  name: string;
  description: string;
  aliases?: string[];
  usage?: string;
  nsfw?: boolean;
  permissions?: {
    client?: Discord.PermissionResolvable[];
    user?: Discord.PermissionResolvable[];
  };
  accessibility?: {
    guildOnly?: boolean;
    owner?: boolean;
    admins?: boolean;
    mods?: boolean;
  };
  arguments?: Argument[];

  // run isnt used past execution, so typing as any here is fine.
  run: (message: Discord.Message, args: ArgumentType[], flags: Map<string, string>) => any; 
}

export class TrollCommand {
  public info: CommandOptions;
  public isAuthorized: ({ member, guild }: Discord.Message) => boolean;
  public run: CommandOptions['run'];

  constructor(client: TrollClient, info: CommandOptions) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false });
    this.info = info;
    this.info.arguments = info.arguments?.map((argument) => ({ required: true, ...argument })) ?? [];
    
    // Generate usage from command name and arguments
    // TODO: Add prefix support
    this.info.usage = this.info.name;
    this.info.arguments?.forEach(a => this.info.usage += a.required ? ` <${a.name}>` : ` [${a.name}]`);
    this.info.usage += /* client.config.suffix */ ':troll~1:' // find a better way to support emoji suffixes
    this.run = info.run;

    // Checks if the user has permission to execute the command before running. This 
    // checks CommandOptions.permissions and CommandOptions.accessibility as defined
    // above.
    this.isAuthorized = ({ member, guild }) => {
      let authorized = false;

      // Role requirement checks
      if (!this.info.accessibility) {
        authorized = true;
      } else if (this.info.accessibility.owner) {
        authorized = member!.id === guild!.ownerId;
      } else if (this.info.accessibility.admins) {
        authorized = member!.roles.cache.some((r) => r.id === client.config.adminRole) || member!.id === guild!.ownerId;
      } else if (this.info.accessibility.mods) {
        authorized = member!.roles.cache.some((r) => [client.config.adminRole, client.config.modRole].includes(r.id)) || member!.id === guild!.ownerId;
      }

      // Permission requirement check 
      if (authorized && this.info.permissions) {
        authorized = member!.permissions.has(this.info.permissions!.user!, true);
      }

      return authorized;
    };
  }
}

// Deprecated, will likely remove or repurpose at some point
export interface Result {
  code: string;
  details?: string;
  error?: Error | Discord.DiscordAPIError;
}

// TODO: flag resolution
export interface Flag { }

// Object in CommandOptions for retrieving arguments
export interface Argument {
  name: string;
  type: 'STRING' | 'NUMBER' | 'MEMBER' | 'USER' | 'CHANNEL' | 'ROLE';
  required?: boolean;
}

// Object in CommandOptions.run for retrieving resolved argument objects
export type ArgumentType = string | number | Discord.GuildMember | Discord.User | Discord.Channel | Discord.Role | null | undefined;
