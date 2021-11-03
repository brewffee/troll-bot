import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const NameResetCommand = new TrollCommand(client, {
  name: 'namereset',
  aliases: ['name'],
  description: '(mod-only) resets guild name',
  accessibility: {
    owner: true,
    admins: true,
    mods: true,
  },
  async run(message: Message) {
    try {
      await message.guild.setName('It\'s called, "We do a little trolling"');
      message.channel.send('much better');
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
