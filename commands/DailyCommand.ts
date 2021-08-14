import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { daily } from '../models/DailyCoins';
import { wallet } from '../models/Wallet';

export const DailyCommand = new TrollCommand(client, {
  name: 'daily',
  aliases: ['d', '24', 'collect'],
  description: 'collect your daily coins',
  async run(message: Message) {
    try {
      const curWallet = await wallet.findOne({ id: message.author.id });
      const lastDaily = await daily.findOne({ id: message.author.id });

      const randomEvent = () => {
        let events = ['tax', 'bills', 'rob', 'gas', 'lost'];
        let chosen = events[Math.floor(Math.random() * 10)];
        let message: string, deficit: number;
        switch (chosen) {
          case 'tax':
            message = 'uh oh! looks like you gotta pay taxes before you cash in :)))\n*2% of your total wallet has been withdrawn*\n\n';
            deficit = Math.round(curWallet.balance * 0.02)
            break;
          case 'bills':
            message = 'ouch! you\'re super behind on your bills!\n*100 coins from your daily were paid to compensate*\n\n';
            deficit = 100;
            break;
          case 'rob':
            message = 'oh no! you\'ve been robbed!\n*600 coins were found missing from your wallet*\n\n';
            deficit = curWallet.balance > 600 ? 600 : curWallet.balance;
            break;
          case 'gas':
            message = 'you ran out of gas on the way to collect your money\n*50 coins were paid at the gas station*\n\n';
            deficit = 50;
            break;
          case 'lost':
            message = 'yikes! looks like you\'ve dropped some of your money somewhere\n*300 coins were missing*\n\n';
            deficit = curWallet.balance > 300 ? 300 : curWallet.balance;
            break;
          default:
            message = 'heres ya daily **250** coins';
            deficit = 0;
            break;
        }
        if (chosen) message += 'heres ya daily **250** coins';
        return { message, deficit, chosen };
      }

      if (!lastDaily || (Date.now() - lastDaily.collectedAt) >= (1000 * 60 * 60 * 24)) {
        const evt = randomEvent();
        message.channel.send(evt.message);

        if (curWallet)
          await wallet.findOneAndUpdate({ id: message.author.id }, { $set: { balance: curWallet.balance + 250 - evt.deficit } });
        else
          await (new wallet({ id: message.author.id, balance: 250 })).save();

        if (lastDaily)
          await daily.findOneAndUpdate({ id: message.author.id }, { $set: { collectedAt: Date.now() } });
        else
          await (new daily({ id: message.author.id, collectedAt: Date.now() })).save();
      } else {
        message.channel.send(`you collected your daily <t:${Math.trunc(lastDaily.collectedAt / 1000)}:R>, chill out`);
      }

    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
