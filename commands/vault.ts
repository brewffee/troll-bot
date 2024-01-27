import { Message, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getStats, humanize } from '../util/dbUtil';
import { UserData } from '../models/User';

export const VaultCommand = new TrollCommand(client, {
  name: 'vault',
  aliases: ['store', 'deposit'],
  description: 'store some money in the bank',
  arguments: [{ name: 'Amount', type: 'NUMBER', required: true }],
  async run(message: Message, args: [number]) {
    const user = await UserData.findOne({ id: message.author.id });

    // A few checks before proceeding: The user must specify how much 
    // money, and have said money
    if (user.balance <= 0) {
      message.channel.send('you don\'t have any money to deposit right now');// use currency later
      return;
    } else if (args[0] <= 0) {
      message.channel.send('you really think you\'re a funny guy huh');
      return
    } else if (!args[0]) {
      message.channel.send('you gotta say how much');
      return;
    } else if (user.balance < args[0]) {
      message.channel.send('you cant deposit more than what you have');
      return;
    }
    
    let current = user.vault;
    if (!current) current = 0;
    console.log('userVault', user.vault, typeof user.vault, current);

    // If this user has just created their vault
    let created: number;
    if (!user.lastVaulted) {
      created = Date.now();
    } else {
      created = user.lastVaulted;
    }

    // Update the user in the database and send the message
    await UserData.findOneAndUpdate(
      { id: message.author.id }, 
      { $set: { 
          vault: current + args[0],
          lastVaulted: created,
          balance: user.balance - args[0]
        } 
      }
    );

    message.channel.send(`just deposited **${args[0]}** coins in your vault for you 👍 \nyou now have **${current + args[0]}** coins in the vault`);
  }
});
