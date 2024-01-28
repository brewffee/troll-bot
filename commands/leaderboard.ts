import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getLeaderboard, getPlaceString, getStats, humanize } from '../util/dbUtil';

export const LeaderboardCommand = new TrollCommand(client, {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'rankings'],
  description: 'see how much better everyone is',
  async run(message: Message) {
    const stats = await getStats(message.author.id);
    const lb = await getLeaderboard(); 

    //message.channel.send(`${lb}\n\nyou're in **${getPlaceString(stats.place)}** with **${humanize(stats.xp)}** karma`);
    return message.reply({ 
      allowedMentions: { repliedUser: false },
      content: `${lb}\n\nyou're in **${getPlaceString(stats.place)}** with **${humanize(stats.xp)}** karma`
    });
  }
});


// Create duplicates for coin system