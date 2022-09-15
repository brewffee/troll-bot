import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getLeaderboard, getPlaceString, getStats, humanize } from '../util/leaderboardUtil';

export const LeaderboardCommand = new TrollCommand(client, {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'rankings'],
  description: 'see how much better everyone is',
  async run(message: Message) {
    try {
      const stats = await getStats(message.author.id);
      const lb = await getLeaderboard();
      message.channel.send(`${lb}\n\nyou're in **${getPlaceString(stats.place)}** with **${humanize(stats.xp)}** karma`);
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});


// Create duplicates for coin system