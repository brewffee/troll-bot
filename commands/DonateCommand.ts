import { Message, User } from 'discord.js';
import { wallet } from '../models/Wallet';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const DonateCommand = new TrollCommand(client, {
  name: 'donate',
  aliases: ['give', 'tip', 'lend'],
  description: 'lend someone some dolars',
  arguments: [
    { name: 'User', type: 'USER', required: true },
    { name: 'Amount', type: 'NUMBER', required: true }
  ],
  async run(message: Message, args: [User, number]) {
    try {
      let curWallet = await wallet.findOne({ id: message.author.id });
      if (!curWallet || curWallet.balance <= 0) {
        message.channel.send('you dont have any money to give away nimbus');
        return;
      } else if (!args[0]) {
        message.channel.send('you cant send money to nobody :/');
        return;
      } else if (curWallet.balance < args[1]) {
        message.channel.send('you cant hand out that kinda money');
        return;
      } else if (!args[1]) {
        message.channel.send('you gotta say how much');
        return;
      }

      let destWallet = await wallet.findOne({ id: args[0].id }); 
      if (destWallet) {
        await wallet.findOneAndUpdate({ id: args[0].id }, { $set: { balance: destWallet.balance + args[1] } })
      } else {
        await (new wallet({ id: args[0].id, balance: args[1] })).save()
      }

      message.channel.send(`you generously gave ${client.config.coin} **${args[1]}** to **${args[0].username}** :)`);
      await wallet.findOneAndUpdate({ id: message.author.id }, { $set: { balance: curWallet.balance - args[1] } })

    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
