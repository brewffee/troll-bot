/* eslint-disable @typescript-eslint/no-var-requires */

import * as Discord from 'discord.js';
import { readdir } from 'fs';
import mongoose from 'mongoose';
import { TrollCommand } from './TrollCommand';
import { TrollEvent } from './TrollEvent';
import { config } from './config';
import { ReminderFormat } from './models/Reminder';
import { checkReminders, loadReminders } from './util/remind';

export interface TrollConfig {
  troll: Discord.EmojiResolvable;
  suffix: string; // TODO: Add suffix support
  cake: Discord.EmojiResolvable;
  coin: Discord.EmojiResolvable;
  reddit: Discord.EmojiResolvable[];
  general: Discord.Snowflake;
  responses: Array<[RegExp, string, Discord.BufferResolvable?]>;
  botRole: Discord.RoleResolvable;
  memberRole: Discord.RoleResolvable;
  adminRole: Discord.RoleResolvable;
  modRole: Discord.RoleResolvable;

  eightball: string[];
  beggars: string[];
  begActions: { [key: string]: string[] };
  dailyEvents: { [key: string]: { message: string; amount: number; chance: number } };
}

export class TrollClient extends Discord.Client {
  public commands = new Discord.Collection<string, TrollCommand>();
  public reminders = new Discord.Collection<string, ReminderFormat>();
  public config!: TrollConfig;
  public db: mongoose.Connection;

  constructor(config: TrollConfig) {
    super({ intents: 3655, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }); 

    this.config = config; 

    // Load commands
    readdir('./out/commands', (err, files) => {
      if (err) throw err;
      files.filter((f) => f.endsWith('.js')).forEach((file) => {
        const command = Object.values(require(`./commands/${file}`))[0] as TrollCommand;
        this.commands.set(command.info.name, command);
      });
    });

    // Load events
    readdir('./out/events', (err, files) => {
      if (err) throw err;
      files.filter((f) => f.endsWith('.js')).forEach((file) => {
        const event = Object.values(require(`./events/${file}`))[0] as TrollEvent;
        this.on(event.info.type, (...args) => event.info.run(this, ...args));
      });
    });

    // Connect db and login
    mongoose.connect(process.env.MONGO_CONNECTION_STRING as string);
    this.db = mongoose.connection;
    this.login();

    // Load all reminders and start the check interval
    loadReminders().then(() => checkReminders()); /* 1000ms */
  }
}

export const client = new TrollClient(config);
