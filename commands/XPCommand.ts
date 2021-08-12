import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getStats, xp } from '../xp';

export const TestCommand = new TrollCommand(client, {
  name: 'xp',
  aliases: ['experience', 'levels', 'karma'],
  description: 'check out how much xp ya got',  
  async run(message) {
    try {
      // allows for getting xp on first msg
      await xp.findOne({ id: message.author.id });

      const stats = await getStats(message.author.id);
      const awards = ['<:rplat:843164215786340442>', '<:rgold:843160855234215968>', '<:rsilver:843164309735735316>'];
      message.channel.send(`you've got **${stats.xp}** karma, placing you at ${stats.place < 4 ? awards[stats.place - 1] + ' ' : ''}**#${stats.place}** in trolling ${client.config.troll}`)
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
