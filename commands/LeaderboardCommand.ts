import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { xp } from '../models/xp';
import { getLeaderboard, getPlaceString, getStats } from '../util/leaderboardUtil';
import { debt } from '../models/Debt';

export const LeaderboardCommand = new TrollCommand(client, {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'rankings'],
  description: 'see how much better everyone is',
  async run(message: Message) {
    try {
      // allows for getting xp on first msg
      await xp.findOne({ id: message.author.id });
      const stats = await getStats(message.author.id);
      const trollBal = Math.abs((await debt.findOne({ id: 1 })).karma).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const trollString = `**0. ${client.user.tag}** with **${trollBal}** karma ${client.config.troll}\n`;
      const lb = await getLeaderboard(client);
      message.channel.send(`${trollString}${lb}\n\nyou're in **${getPlaceString(stats.place)}** with **${stats.xp}** karma`);
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});


