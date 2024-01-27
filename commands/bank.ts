import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

export const WithdrawCommand = new TrollCommand(client, {
  name: 'bank',
  aliases: [],
  description: 'check what\'s in your bank vault',
  arguments: [],
  async run(message: Message) {
    const user = await UserData.findOne({ id: message.author.id });

    // A The user must have money in their vault
    if (!user.vault || user.vault === 0) {
      message.channel.send('there\'s no money in your bank');// use currency later
      return;
    } 

    // Amount of money in the vault
    let starting = user.vault;

    // Multiply the amount given based on the amount of days
    let daysSince = Math.floor(Math.abs((user.lastVaulted - Date.now())  / (1000 * 3600 * 24)));
    let multiplier = 1 + (daysSince / 10);
    let value = Math.floor(starting * multiplier);
    let percent = ( (value - starting) / starting ) * 100;

    let hasIncreased = starting === value;

    message.channel.send(`you have **${value}** coins in your vault ${hasIncreased ? "" : `( compared to your initial ${starting}, that's a ${percent}% increase )`}`);
  }
});
