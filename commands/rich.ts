import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getEcoStats, getPlaceString, getRichest, humanize } from '../util/dbUtil';

export const LeaderboardCommand = new TrollCommand(client, {
  name: 'rich',
  aliases: ['richest', 'ecotop'],
  description: 'see how RIIIICH everyone is',
  async run(message: Message) {
    try {
      const stats = await getEcoStats(message.author.id);
      const lb = await getRichest();
      message.channel.send(`${lb}\n\nyou're in **${getPlaceString(stats.place)}** with ${client.config.coin} **${humanize(stats.balance)}**`);
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});


// Create duplicates for coin system