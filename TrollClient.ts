import { BufferResolvable, Client, Collection, EmojiResolvable, RoleResolvable, Snowflake, TextChannel } from 'discord.js';
import { readdir } from 'fs';
import { TrollCommand } from './TrollCommand';
import { TrollEvent } from './TrollEvent';
import { config } from './config';
import mongoose from 'mongoose';
import { Reminder, ReminderFormat } from './models/Reminder';

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

    // Load all reminders from db (THIS GETS MOVED TO A SEPARATE FILE LATER)
    Reminder.find({}, (err, docs) => {
      if (err) throw err;
      for (const doc of docs) {
        this.reminders.set(doc.id, doc);
      }
    });

    // Check reminders every second
    setInterval(() => {
      for (const reminder of this.reminders.values()) {
        console.log(reminder, Date.now());
        if (reminder.time <= Date.now()) {
          // if the reminder is off by a long time (more than 5 minutes), express that
          const offset = Date.now() - reminder.time;
          const isLate = offset > 300000; 

          if (reminder.direct) {
            this.users.cache.get(reminder.id).send(reminder.reminder);
          } else {
            let guild = this.guilds.cache.first(); // TODO: make this work with multiple guilds
            let channel = guild.channels.cache.get(reminder.channel) as TextChannel;
            channel.send(`<@${reminder.id}> ${reminder.reminder}`);
          }

          // delete the reminder from the db and client.reminders
          this.reminders.delete(reminder.id);
          Reminder.deleteOne({ id: reminder.id }, (err) => {
            if (err) throw err;
          });
        }
      }
    }, 1000);    

  }
}

export const client = new TrollClient(config);
