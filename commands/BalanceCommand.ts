import { Message, User } from 'discord.js';
import { wallet } from '../models/Wallet';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const BalanceCommand = new TrollCommand(client, {
  name: 'balance',
  aliases: ['bal', 'bank', 'coins', 'wallet', 'cash'],
  description: 'see what you got in the bank',
  arguments: [{ name: 'User', type: 'USER', required: false }],
  async run(message: Message, args: [User]) {
    try {
      let curWallet = await wallet.findOne({ id: (args[0] || message.author).id });
      if (!curWallet) {
        message.channel.send(`${!args[0] || args[0] === message.author ? 'you' : 'they'} broke as fuck!`);
      }

      message.channel.send(
        (args[0]
          ? `${args[0].username.toLowerCase()}'s `
          : `you've `
        ) + `got ${client.config.coin} **${curWallet.balance}** in the bank 😎`
      );

    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
