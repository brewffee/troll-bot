import { ImageSize, Message, MessageAttachment, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const AvatarCommand = new TrollCommand(client, {
  name: '8ball',
  aliases: ['ben'],
  description: 'ask the magic 8ball a question',
  arguments: [{ name: 'Question', type: 'STRING', required: true }],
  async run(message: Message, args: [string]) {
    try {
        if (args[0].length < 1) {
            message.channel.send('you gotta ask something');
            return;
        }

        let answers = [
            'oh yeah',
            'i think so',
            '💯',
            'on god',
            'sure',
            'yass',
            'methinks yes',
            '<:ben:948262294402531348> yes', // ben
            'sorry im busy gaming ttyl',
            'not now',
            'ratio',
            'bro i dont know',
            'uhhh try again',
            'cant guarantee it',
            '<:ben:948262294402531348> no', // ben
            'naur',
            'i dont think so',
            'yikes',
        ];
        let answer = answers[Math.floor(Math.random() * answers.length)];

        message.channel.send(answer);
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member!.user.username} ran command "${(this as any).info.name}"` };
    }
  },
});
