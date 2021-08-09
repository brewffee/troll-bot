import { Message, MessageAttachment } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

export const ResponseEvent = new TrollEvent(client, {
  name: 'ResponseEvent',
  description: 'i am doing your mother',
  type: 'responder',
  run: async (client: TrollClient, message: Message) => {
    if (message.channel.id === client.config.iconChannel) {
      return client.emit('guildIconShit', message);
    }
    client.config.responses.forEach((i) => {
      if (i[0].test(message.content)) {  
        message.channel.send({content:i[1],files:i[2]?[new MessageAttachment(i[2])]:undefined});  
      }
    });
  },
});
