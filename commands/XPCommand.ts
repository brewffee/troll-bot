import { Message, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { xp } from '../models/xp';
import { getStats } from '../util/leaderboardUtil';

export const TestCommand = new TrollCommand(client, {
  name: 'xp',
  aliases: ['experience', 'levels', 'karma'],
  description: 'check out how much xp ya got',
  arguments: [{ name: 'User', type: 'USER', required: false }],
  async run(message: Message, args: [User]) {
    try {
      let a = await xp.findOne({ id: (args[0] || message.author).id });
      if (!a) {
         message.channel.send(`${!args[0] || args[0] === message.author ? 'you' : 'they'} dont have any xp yet!`);
      }

      const stats = await getStats((args[0] || message.author).id);
      const awards = ['<:rplat:843164215786340442>', '<:rgold:843160855234215968>', '<:rsilver:843164309735735316>'];
      message.channel.send(
        (args[0]
          ? `${args[0].username.toLowerCase()} has **${stats.xp}** karma, placing them at`
          : `you've got **${stats.xp}** karma, placing you at`
        ) + ` ${stats.place < 4 ? awards[stats.place - 1] + ' ' : ''}**#${stats.place}** in trolling ${client.config.troll}`
      );

    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
