import { Message, User } from 'discord.js';
import { client } from '../TrollClient';
import { Result, TrollCommand } from '../TrollCommand';

export const AvatarCommand = new TrollCommand(client, {
  name: 'avatar',
  description: 'string',
  aliases: ['string[]'],
  usage: 'string',
  nsfw: false,
  arguments: [{ name: 'User', type: 'USER' }],
  run: async (message: Message, args: [User], flags: Map<string, string>): Promise<Result | undefined> => {
    message.channel.send(args[0].displayAvatarURL());

    return undefined;
  },
});
