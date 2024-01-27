import { AllowedImageSize, Message, MessageAttachment, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const AvatarCommand = new TrollCommand(client, {
  name: 'avatar',
  aliases: ['pfp', 'clown'],
  description: 'show a clown on the screen',
  arguments: [{ name: 'User', type: 'USER', required: false }],
  async run(message: Message, args: [User], flags: Map<'size', string>) {
    const size = flags.get('size');
    const isValid = size ? [16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(Number.parseInt(size)) : false;
    const user = args[0] || message.author;
    
    const avatar = user.displayAvatarURL({
      format: 'png',
      size: (isValid ? Number(size) as AllowedImageSize : 512),
      dynamic: true,
    });
  
    message.channel.send({
      content: 'lol look at this clown',
      files: [new MessageAttachment(avatar)],
    });
  },
});
