import { client, TrollClient } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getLeaderboard, getStats } from '../xp';

export const LeaderboardCommand = new TrollCommand(client, {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'rankings'],
  description: 'see how much better everyone is',  
  async run(message) {
    try {
      console.log('HELOOOO????');
      const stats = await getStats(message.author.id);
      const lb = await getLeaderboard(client);
      message.channel.send(`${lb}\n\nyou're in **${stats.place}** with **${stats.xp}** karma`);
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});


