import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

export const BegCommand = new TrollCommand(client, {
  name: 'beg',
  description: 'ask for money (L poor)',
  async run(message: Message) {
    let user = await UserData.findOne({ id: message.author.id });
    
    // TODO: move success chance to config
    let isSuccessful = Math.random() > 0.3;

    let people = client.config.beggars;
    let actions = client.config.begActions;

    let amounts = [       // 1-9
      ...Array.from(new Array(21), (_, i) => 10 + i * 2),     // 10-50 ( increments of 2 )
      ...Array.from(new Array(18), (_, i) => 75 + i * 25),    // 75-500 ( increments of 25 )
    ];

    // The array for constructing the message depends on the outcome 
    let actionArr = isSuccessful ? actions.successful : actions.unsuccessful;

    let [person, action, amount]: [string, string, number] = [
      people[Math.floor(Math.random() * people.length)],        // person
      actionArr[Math.floor(Math.random() * actionArr.length)],  // gave you/took your
      amounts[Math.floor(Math.random() * amounts.length)]       // X coins
    ];

    // If the beg is sucessful or if you have coins to steal, construct the response as normal
    let response = `**${person}** ${action} **${amount}** coins`;
    if (!isSuccessful) response += client.config.troll;

    // If you lose all of your money or don't have any money at all, construct differently
    if (!isSuccessful && amount > user.balance && user.balance > 0) {
      response = response.replace(`**${amount}**`, `**${user.balance}**`);
    } else if (!isSuccessful && user.balance === 0) {
      return message.channel.send(`**${person}** tried to rob you of your money, but you're broke as fuck! lmfao !!!`);
    }

    // Update the user in the database and send the message
    await UserData.findOneAndUpdate(
      { id: message.author.id }, 
      { $set: { 
        balance: isSuccessful
          ? (user.balance + amount)
          : (amount > user.balance ? 0 : user.balance - amount)
      } }
    );

    message.channel.send(response);
  }
});
