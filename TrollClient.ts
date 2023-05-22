import { BufferResolvable, Client, Collection, EmojiResolvable, RoleResolvable, Snowflake, TextChannel } from 'discord.js';
import { readdir } from 'fs';
import { TrollCommand } from './TrollCommand';
import { TrollEvent } from './TrollEvent';
import { config } from './config';
import mongoose from 'mongoose';
import { ReminderFormat } from './models/Reminder';
import { checkReminders, loadReminders } from './util/remind';

export interface TrollConfig {
  troll: EmojiResolvable;
  suffix: string;
  cake: EmojiResolvable;
  coin: EmojiResolvable;
  reddit: EmojiResolvable[];
  general: Snowflake;
  responses: Array<[RegExp, string, BufferResolvable?]>;
  botRole: RoleResolvable;
  memberRole: RoleResolvable;
  adminRole: RoleResolvable;
  modRole: RoleResolvable;

  eightball: string[];
  beggars: string[];
  begActions: { [key: string]: string[] };

  // object:{
  //  bills: {
   //   message: 'ouch! you\'re super behind on your bills!\n*100 coins from your daily were paid to compensate*\n\n',
  //    amount: 100,
   //  chance: 0.1,
  //   },

  dailyEvents: { [key: string]: { message: string; amount: number; chance: number } };
}

export class TrollClient extends Client {
  public commands = new Collection<string, TrollCommand>();
  public reminders = new Collection<string, ReminderFormat>();
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
    mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    this.db = mongoose.connection;
    this.login().then(() => this.guilds.cache.first().members.fetch({ force: true }));

    // Load all reminders and start the check interval
    loadReminders().then(() => checkReminders()); /* 1000ms */
  }
}

export const client = new TrollClient(config);
