import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

export const BegCommand = new TrollCommand(client, {
  name: 'beg',
  description: 'ask for money (L poor)',
  async run(message: Message) {
    try {
      let user = await UserData.findOne({ id: message.author.id });

      // 3/4 chance of success
      let isSuccessful = Math.random() < 0.75;

      let people = client.config.beggars;
      let actions = client.config.begActions;

      let amounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 22, 25, 30, 32, 36, 40, 45, 50, 56, 100, 125, 150, 200, 250, 500];

      let outcome = [
        people[Math.floor(Math.random() * people.length)], // person
        isSuccessful 
        ? actions.successful[Math.floor(Math.random() * actions.successful.length)] 
        : actions.unsuccessful[Math.floor(Math.random() * actions.unsuccessful.length)], // gave you/took your
        amounts[Math.floor(Math.random() * amounts.length)] // X coins
      ];

      let response = `**${outcome[0]}** ${outcome[1]} **${outcome[2]}** coins `;
      if (!isSuccessful) response += client.config.troll;

      await UserData.findOneAndUpdate(
        { id: message.author.id }, 
        (isSuccessful) ? { $set: { balance: user.balance + (outcome[2] as number) } }
        : { $set: { balance: outcome[2] > user.balance ? 0 : user.balance - (outcome[2] as number)} }
      );

      if (outcome[2] > user.balance && user.balance > 0) {
        response = response.replace(`**${outcome[2]}**`, `**${user.balance}**`);
      } else if (user.balance === 0) {
        // bro is broke
        response = `**${outcome[0]}** tried to rob you of your money, but you're broke as fuck! lmfao !!!`;
      }

      message.channel.send(response);
      
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
