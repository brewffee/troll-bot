import { Message, MessageEmbed, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const UserCommand = new TrollCommand(client, {
  name: 'user',
  description: 'check out people\'s stuff',
  arguments: [{ name: 'User', type: 'USER', required: false }],
  async run(message: Message, args: [User], flags: Map<string, string>) {
    try {
      const user = (args[0] || message.author);
      const profileEmbed = new MessageEmbed({ 
        title: `${(args[0] || message.author).username}'s profile`,
        thumbnail: { url: (args[0] || message.author).displayAvatarURL() }
      })
      message.channel.send({ embeds: [profileEmbed] });
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member!.user.username} ran command "${(this as any).info.name}"` };
    }
  },
});
