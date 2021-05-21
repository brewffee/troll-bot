import { Message } from "discord.js";
import { TrollClient, client } from "../TrollClient";
import { TrollCommand } from "../TrollCommand";
import { TrollEvent } from "../TrollEvent";

export const MessageEvent = new TrollEvent(client, {
  name: 'MessageEvent',
  description: 'emj',
  type: 'message',
  run: async (client: TrollClient, message: Message) => {
    if (message.author.bot) return;
    const data = message.content.split(/ +/g)
    if (!data[0].endsWith(client.config.suffix)) return console.log('does not! emit response')
    const args = data.filter(a => !a.startsWith('--'));
    const flags = data.filter(a => /^-{1,2}/.test(a));
    const commandName = data[0].replace(client.config.suffix, '')
    const command: TrollCommand = client.commands.get([commandName]);
    console.log(
      {
        args: args,
        commandName: commandName,
        isCommand: Boolean(command),
        flags: flags,
      })
    if (!command) return;
    command.run(message)
  }
});

