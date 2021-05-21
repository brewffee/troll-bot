import { Message, PermissionResolvable } from "discord.js";
import { TrollClient } from './TrollClient';

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
  run: Function,
}

export class TrollCommand {
  public info: CommandOptions;
  public isAuthorized: Function;
  public run: Function;
  constructor(client: TrollClient, info: CommandOptions) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false })
    this.info = info;
    this.run = info.run;
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
