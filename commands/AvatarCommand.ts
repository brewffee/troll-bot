import { Message, User } from 'discord.js';
import { client } from '../TrollClient';
import { Result, TrollCommand } from '../TrollCommand';

export const AvatarCommand = new TrollCommand(client, {
  name: 'avatar',
  description: 'string',
  usage: 'avatar:troll: [User]',
  arguments: [{ name: 'User', type: 'USER' }],
  run: async (message: Message, args: [User], flags: Map<string, string>): Promise<Result | undefined> => {
    message.channel.send((args[0] || message.author).displayAvatarURL());
    return { code: 'OK' }
  },
});
