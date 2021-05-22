import { Client, Collection, Intents } from 'discord.js';
import { readdir } from 'fs';
import { TrollCommand } from './TrollCommand';

interface TrollConfig {
  suffix: string;
}

export class TrollClient extends Client {
  public commands: Collection<string[], any>;
  public load: Function;
  public config!: TrollConfig;
  constructor() {
    super({ intents: Intents.ALL });
    this.commands = new Collection();
    this.load = (config: TrollConfig) => {
      this.config = config;
      readdir(`./out/commands`, (err, files) => {
        if (err) throw err;
        files
          .filter((f) => f.endsWith('.js'))
          .forEach((file) => {
            const command = Object.values(require(`./commands/${file}`))[0] as TrollCommand;
            this.commands.set(command.info.names, command.info.run);
          });
      });
      readdir('./out/events', (err, files) => {
        if (err) throw err;
        files
          .filter((f) => f.endsWith('.js'))
          .forEach((file) => {
            const event = Object.values(require(`./events/${file}`))[0] as any;
            this.on(event.info.type, event.info.run.bind(null, this));
          });
      });
      this.login();
    };
  }
}
export const client = new TrollClient();
client.load({ suffix: '<:troll:841760436042203138>' });
