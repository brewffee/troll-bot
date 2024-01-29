import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

export const WithdrawCommand = new TrollCommand(client, {
  name: 'withdraw',
  aliases: [],
  description: 'withdraw money from the bank',
  arguments: [{ name: 'Amount', type: 'NUMBER', required: true }],
  async run(message: Message, args: [number]) {
    const user = await UserData.findOne({ id: message.author.id });

    // Multiply the amount given based on the amount of days
    let daysSince = Math.floor(Math.abs((user.lastVaulted - Date.now())  / (1000 * 3600 * 24)));
    let multiplier = 1 + (daysSince / 10);
    let value = Math.floor(user.vault * multiplier);
    let earnings = Math.floor(args[0] * multiplier);

    // A few checks before proceeding: The user must specify how much 
    // money, and have said money in their vault
    if (!user.vault || user.vault === 0) {
      // message.channel.send('there\'s no money in your bank');// use currency later
      // return;
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: "there's no money in your bank",
      });
    } else if (args[0] <= 0) {
      // message.channel.send('you really think you\'re a funny guy huh');
      // return
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: "you really think you're a funny guy huh",
      });
    } else if (!args[0]) {
      // message.channel.send('you gotta say how much');
      // return;
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: 'you gotta say how much',
      });
    } else if (value < args[0]) {
      // message.channel.send('you cant withdraw more than what you have');
      // return;
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: 'you cant withdraw more than what you have',
      });
    }

    // Amount of money in the vault
    let current = value;

    // Update the user in the database and send the message
    await UserData.findOneAndUpdate(
      { id: message.author.id }, 
      { $set: { 
          vault: current - args[0],
          lastVaulted: Date.now(),
          balance: user.balance + earnings
        } 
      }
    );

    // message.channel.send(`here's your **${earnings}** coins, straight from the bank 👍 \nyou now have **${current - args[0]}** coins in the vault`);
    return message.reply({ 
      allowedMentions: { repliedUser: false },
      content: `here's your **${earnings}** coins, straight from the bank 👍 \nyou now have **${current - args[0]}** coins in the vault`,
    });
  }
});
