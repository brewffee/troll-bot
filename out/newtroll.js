"use strict";
/*import { Client, MessageAttachment, Intents, version, Collection } from 'discord.js';
import * as fs from 'fs';

export class TrollClient extends Client {
  public commands: Collection<string[], any>
  public load: Function
  constructor() {
    super({ intents: Intents.ALL })
    this.commands = new Collection()
    this.load = () => {
      fs.readdir(`./out/commands`, (err, files) => {
        if (err) throw err
        files.filter(f => f.endsWith('.js')).forEach(file => {
          const command = require(`../commands/${file}`)
          this.commands.set(command.names, command.run)
        })
      })
      fs.readdir('./out/events', (err, files) => {
        if (err) throw err
        files.forEach(file => {
          const event = require(`../events/${file}`)
          this.on(event.type, event.bind(null, this))
        })
      })
      this.login(process.env.DISCORD_TOKEN)
    }
  }
}

export class TrollCommand {
  
}*/ 
//# sourceMappingURL=newtroll.js.map