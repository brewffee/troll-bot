import { exec, execSync } from 'child_process';
import { Message } from 'discord.js';
import { statSync } from 'fs';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
const fetch = require('node-fetch');

export const guildIconShit = new TrollEvent(client, {
  name: 'guildIconShit',
  description: 'sets the guild icon',
  type: 'guildIconShit',
  run: async (_client: TrollClient, message: Message) => {
    const url = message.attachments?.first()?.url || message.content;
    if (/(https?:\/\/.+\.(jpe?g|png|webp|gif)(\?.+)?)/i.test(url)) {
      let size: number = await (await fetch(url, {method: 'HEAD'})).headers.get('content-length') / 1000
      if (size > 10240) return message.channel.send('bro you expect me to upload all of that? upload something less than 10mb goddamn');
      else if (size * 1000 < 300) return message.channel.send('i need a microscope to see that shit 😐');
      return Math.floor(Math.random() * 2) === 1
        ? message.channel.send('changed the guild icon').then(() => message.guild!.setIcon(url))
        : message.channel.send('hah! shit luck');
    } else {
      return message.channel.send('that file isnt a supported image! supported types are: jpg, jpeg, png, webp, and gif (tenor gifs are not supported)');
    }
  },
});
