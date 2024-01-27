import { GuildMember, Message } from 'discord.js';
import { UserData } from '../models/User';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { humanize } from '../util/dbUtil';

export const BalanceCommand = new TrollCommand(client, {
  name: 'balance',
  aliases: ['bal', 'bank', 'coins', 'wallet', 'cash'],
  description: 'see what you got in the bank',
  arguments: [{ name: 'User', type: 'MEMBER', required: false }],
  async run(message: Message, args: [GuildMember]) {
    if (args[0] === null) {
      return message.channel.send('i don\'t know who that is, sorry');
    }
    
    const member = args[0] || message.member;
    const { balance } = await UserData.findOne({ id: member.id }) ?? { balance: null };

    const name = member === message.member ? "you" : `**${member.displayName.toLowerCase()}**`;

    // If balance is none , 0 , or negative
    if (balance === null) {
      return message.channel.send(`${name} don\'t seem to have a wallet, get out there and make some bank first`)
    } else if (balance === 0) {
      return message.channel.send(`${name} broke as fuck!`);
    } else if (balance < 0) {
      return message.channel.send(`${name} got a negative balance of ${client.config.coin} **${humanize(balance)}**, yikes`)
    }

    // Should we add leaderboard placement (like in XPCommand) ?
    message.channel.send(`${name} got ${client.config.coin} **${humanize(balance)}** in the bank 😎`);
  }
});
