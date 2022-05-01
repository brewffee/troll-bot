import { BufferResolvable, ChannelResolvable, Client, Collection, EmojiResolvable, RoleResolvable, Snowflake } from 'discord.js';
import { readdir } from 'fs';
import { TrollCommand } from './TrollCommand';
import { TrollEvent } from './TrollEvent';
import { config } from './config';
import mongoose from 'mongoose';

export interface TrollConfig {
  troll: EmojiResolvable;
  suffix: string;
  cake: EmojiResolvable;
  coin: EmojiResolvable;
  reddit: EmojiResolvable[]; // enable feature disabling later :P
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
  public db: mongoose.Connection;
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
          this.on(event.info.type, (...args) => event.info.run(this, ...args));
        });
      });
      mongoose.connect(process.env.MONGO_CONNECTION_STRING);
      this.login().then(() => this.guilds.cache.first().members.fetch({ force: true }));
    };
    this.db = mongoose.connection;
  }
}

export const client = new TrollClient();

client.load(config);