import { Message, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

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
      const user = await UserData.findOne({ id: message.author.id });

      if (user.balance <= 0) {
        message.channel.send('you dont have any money to give away nimbus');
        return;
      } else if (!args[0]) {
        message.channel.send('you cant send money to nobody :/');
        return;
      } else if (user.balance < args[1]) {
        message.channel.send('you cant hand out that kinda money');
        return;
      } else if (!args[1]) {
        message.channel.send('you gotta say how much');
        return;
      }

      let dest = await UserData.findOne({ id: args[0].id });

      await UserData.findOneAndUpdate(
        { id: args[0].id }, 
        { $set: { balance: dest.balance + args[1] } }
      );

      await UserData.findOneAndUpdate(
        { id: message.author.id },
        { $set: { balance: user.balance - args[1] } }
      );

      message.channel.send(`you generously gave ${client.config.coin} **${args[1]}** to **${args[0].username}** :)`);

    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
