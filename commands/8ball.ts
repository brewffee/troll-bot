import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const AvatarCommand = new TrollCommand(client, {
  name: '8ball',
  aliases: ['ben'],
  description: 'ask the magic 8ball a question',
  arguments: [{ name: 'Question', type: 'STRING', required: true }],
  async run(message: Message, args: [string]) {
    if (!args[0]?.length) {
      return message.channel.send("the 8ball may be magic but it can't read your mind, dummy");
    }
  
    const { eightball } = client.config;
    const answer = eightball[Math.floor(Math.random() * eightball.length)];
    
    return message.channel.send(answer);
  },
});
