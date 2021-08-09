import { BufferResolvable, ChannelResolvable, Client, Collection, EmojiResolvable, RoleResolvable, Snowflake } from 'discord.js';
import { readdir } from 'fs';
import { TrollCommand } from './TrollCommand';
import { TrollEvent } from './TrollEvent';
import { config } from './config';

export interface TrollConfig {
  troll: EmojiResolvable;
  suffix: string;
  cake: EmojiResolvable;
  reddit: EmojiResolvable[]; // enable feature disabling later :P
  iconChannel: ChannelResolvable;
  general: Snowflake;
  responses: Array<[RegExp, string, BufferResolvable?]>;
  botRole: RoleResolvable;
  memberRole: RoleResolvable;
  adminRole: RoleResolvable;
  modRole: RoleResolvable;
}

export class TrollClient extends Client {
  public commands = new Collection<string, TrollCommand>();
  public load: Function;
  public config!: TrollConfig;
  constructor() {
    super({ intents: 3655 });
    this.load = (config: TrollConfig) => {
      this.config = config;
      readdir(`./out/commands`, (err, files) => {
        if (err) throw err;
        files.filter((f) => f.endsWith('.js')).forEach((file) => {
          const command = Object.values(require(`./commands/${file}`))[0] as TrollCommand;
          this.commands.set(command.info.name, command);
        });
      });
      readdir('./out/events', (err, files) => {
        if (err) throw err;
        files.filter((f) => f.endsWith('.js')).forEach((file) => {
          const event = Object.values(require(`./events/${file}`))[0] as TrollEvent;
          this.on(event.info.type, event.info.run.bind(null, this));
        });
      });
      this.login();
    };
  }
}

export const client = new TrollClient();

client.load(config);