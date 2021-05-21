import { Client, Intents, Collection } from 'discord.js';
import * as fs from 'fs';
import { TrollCommand } from './TrollCommand';

interface TrollConfig {
  suffix: string;
}

export class TrollClient extends Client {
  public commands: Collection<string[], any>
  public load: Function
  public config!: TrollConfig;
  constructor() {
    super({ intents: Intents.ALL })
    this.commands = new Collection()
    this.load = (config: TrollConfig) => {
      this.config = config
      fs.readdir(`./out/commands`, (err, files) => {
        if (err) throw err
        files.filter(f => f.endsWith('.js')).forEach(file => {
          const command = Object.values(require(`./commands/${file}`))[0] as TrollCommand
          this.commands.set(command.info.names, command.info.run)
        })
      })
      fs.readdir('./out/events', (err, files) => {
        if (err) throw err        
        files.filter(f => f.endsWith('.js')).forEach(file => {
          const event = Object.values(require(`./events/${file}`))[0] as any
          console.log([Object.values(event)[0]]);
          this.on(event.info.type, event.info.run.bind(null, this)) 
        })
      })
    this.login('ODQ1MzY4ODg3ODgwMzE4OTc3.YKf9IQ.zMiPPLKCeBdT3uHzbRsbQEQL1SM')
    }
  }
}

export const client = new TrollClient()
client.load({ suffix: '<:troll:841760436042203138>' });