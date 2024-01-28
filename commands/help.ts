import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const HelpCommand = new TrollCommand(client, {
  name: 'help',
  aliases: ['?'],
  description: 'see commands and shit',
  async run(message: Message) {
    let list = 'howdy, check my shit out\n';
    client.commands.forEach(c => {
      const { name, description, usage, accessibility } = c.info;
      if (accessibility?.owner) return;
      list += `**${name}** [\`${usage}\`] - ${description}\n`;
    });

    return message.reply({ 
      allowedMentions: { repliedUser: false },
      content: list
    });
    // message.channel.send(list);
  }
});
