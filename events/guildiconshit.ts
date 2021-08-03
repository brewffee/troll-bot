
import { Message } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

export const guildIconShit = new TrollEvent(client, {
  name: 'guildIconShit',
  description: 'sets the guild icon',
  type: 'guildIconShit',
  run: async (_client: TrollClient, message: Message) => {
    const url = message.attachments?.first()?.url || message.content;
    console.log(message.channel);
    if (/(https?:\/\/.+\.(jpe?g|png|webp|gif)(\?.+)?)/i.test(url)) {
      return Math.floor(Math.random() * 2) === 1
        ? message.channel.send('changed the guild icon').then(() => message.guild!.setIcon(url))
        : message.channel.send('hah! shit luck');
    } else {
      return message.channel.send('that file isnt a supported image! supported types are: jpg, jpeg, png, webp, and gif (tenor gifs are not supported)');
    }
  },
});
