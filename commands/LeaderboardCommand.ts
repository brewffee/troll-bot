import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getLeaderboard, getPlaceString, getStats, xp } from '../xp';

export const LeaderboardCommand = new TrollCommand(client, {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'rankings'],
  description: 'see how much better everyone is',
  async run(message: Message) {
    try {
      // allows for getting xp on first msg
      await xp.findOne({ id: message.author.id });

      const stats = await getStats(message.author.id);
      const lb = await getLeaderboard(client);
      message.channel.send(`${lb}\n\nyou're in **${getPlaceString(stats.place)}** with **${stats.xp}** karma`);
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});


