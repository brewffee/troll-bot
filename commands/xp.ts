import { Message, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getStats, humanize } from '../util/dbUtil';
import { UserData } from '../models/User';

export const XPCommand = new TrollCommand(client, {
  name: 'xp',
  aliases: ['experience', 'levels', 'karma'],
  description: 'check out how much xp ya got',
  arguments: [{ name: 'User', type: 'USER', required: false }],
  async run(message: Message, args: [User]) {
    let user = await UserData.findOne({ id: (args[0] || message.author).id });
    if (!user.xp) {
      message.channel.send(`${!args[0] || args[0] === message.author ? 'you' : 'they'} dont have any xp yet!`);
    }

    const stats = await getStats((args[0] || message.author).id);
    const awards = ['<:rplat:843164215786340442>', '<:rgold:843160855234215968>', '<:rsilver:843164309735735316>'];
    message.channel.send(
      (args[0]
        ? `${args[0].username.toLowerCase()} has **${stats.xp}** karma, placing them at`
        : `you've got **${humanize(stats.xp)}** karma, placing you at`
      ) + ` ${stats.place < 4 ? awards[stats.place - 1] + ' ' : ''}**#${stats.place}** in trolling ${client.config.troll}`
    );
  }
});
