import { Message } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

export const guildNameShit = new TrollEvent(client, {
  name: 'guildNameShit',
  description: 'sets the guild name',
  type: 'guildNameShit',
  run: async (_client: TrollClient, message: Message) => {
    if (message.content.length < 4 || message.content.length > 64) {
      return message.channel.send('try staying between 4 and 64 characters');
    }

    if (/troll/gi.test(message.content)) {
      return Math.random() > 0.875
        ? message.channel.send('changed the guild name').then(() => message.guild.setName(message.content))
        : message.channel.send('hah! shit luck');
    }

  },
});
