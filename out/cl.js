"use strict";
/*import { Message, MessageOptions, PermissionResolvable, Permissions } from "discord.js";
import { TrollClient } from './newtroll';

export class TrollCommand {
  public info: CommandOptions;
  public isAuthorized: Function;
  constructor(client: TrollClient, info: CommandOptions) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false })
    this.info = info;
    this.isAuthorized = ({ member, guild }: Message): boolean => {
      let authorized: boolean = false;
      if (!this.info.accessibility) {
        authorized = true;
      } else if (this.info.accessibility.owner) {
        authorized = member!.id === guild!.ownerID
      } else if (this.info.accessibility.admins) {
        authorized = member!.roles.cache.some(r => r.id === '842802299675213824') || member!.id === guild!.ownerID
      } else if (this.info.accessibility.admins) {
        authorized = member!.roles.cache.some(r => ['842802299675213824', '842802567499219005'].includes(r.id)) || member!.id === guild!.ownerID
      }
      
      if (authorized || this.info.permissions) {
        authorized = member!.permissions.has(this.info.permissions!.user!, true)
      }

      return authorized
    }
  }
}

interface CommandOptions {
  names: string[],
  description: string,
  argCount?: [number, string],
  usage: string,
  nsfw?: boolean,
  permissions?: {
    client?: PermissionResolvable[],
    user?: PermissionResolvable[],
  }
  accessibility?: {
    guildOnly?: boolean
    owner?: boolean,
    admins?: boolean,
    mods?: boolean,
  },
}

export class TestCommand extends TrollCommand {
  constructor(client: TrollClient) {
    super(client, {
      names: ['test', 'alias'],
      description: 'emj',
      argCount: undefined,
      usage: '',
      permissions: {
        client: ['MANAGE_MESSAGES'],
        user: ['MANAGE_EMOJIS']
      },
      accessibility: {
        owner: true
      },
    });
  }
  run(message: Message) {
    message.channel.send('<:water:689488678380503041>')
  };

}*/ 
//# sourceMappingURL=cl.js.map