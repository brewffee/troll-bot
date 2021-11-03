import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const IconResetCommand = new TrollCommand(client, {
  name: 'iconreset',
  aliases: ['icon'],
  description: '(mod-only) resets guild icon',
  accessibility: {
    owner: true,
    admins: true,
    mods: true,
  },
  async run(message: Message) {
    try {
      message.guild.setIcon('https://cdn.discordapp.com/attachments/843886522271793182/905246215971672134/891744450752163891.png');
      // use a local image later
      message.channel.send('much better');
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
