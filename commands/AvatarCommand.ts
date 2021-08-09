import { ImageSize, Message, MessageAttachment, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const AvatarCommand = new TrollCommand(client, {
  name: 'avatar',
  aliases: ['pfp'],
  description: 'show a clown on the screen',
  arguments: [{ name: 'User', type: 'USER', required: false }],
  async run(message: Message, args: [User], flags: Map<string, string>) {
    try {
      let key, val: string, isValid;
      if (flags.size > 0) {
        key = flags.entries().next().value[0]; // i really want to name it 'size'
        val = flags.entries().next().value[1];
        isValid = key === 'size' && [16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(Number(val));
      }
      message.channel.send({
        content: 'lol look at this clown',
        files: [new MessageAttachment((args[0] || message.author).displayAvatarURL({ format: 'png', size: isValid ? Number(val!) as ImageSize : 512 }))],
      });
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member!.user.username} ran command "${(this as any).info.name}"` };
    }
  },
});
