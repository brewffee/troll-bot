import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

export const DailyCommand = new TrollCommand(client, {
  name: 'daily',
  aliases: ['d', '24', 'collect'],
  description: 'collect your daily coins',
  async run(message: Message) {
    const user = await UserData.findOne({ id: message.author.id });

    // A random unlucky event to occur when running the daily command
    const randomEvent = () => {
      const events = Object.keys(client.config.dailyEvents);        
      return client.config.dailyEvents[events[Math.floor(Math.random() * 10)]];
    }; 

    // If the user is eligible for recieving their daily payout ...
    if ((Date.now() - user.lastDaily) >= (1000 * 60 * 60 * 24)) {
      let event = randomEvent();
      let msg = 'heres ya daily **250** coins';
      let deduction = 0;

      if (event) {
        msg = event.message + msg;
        deduction = event.amount;
      }

      await UserData.findOneAndUpdate(
        { id: message.author.id }, 
        { $set: { 
            balance: (user.balance + 250) - deduction ,
            lastDaily: Date.now()
        } }
      );

      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: msg
      });
    } else {
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: `you collected your daily <t:${Math.trunc(user.lastDaily / 1000)}:R>, chill out`
      });
      // message.channel.send(`you collected your daily <t:${Math.trunc(user.lastDaily / 1000)}:R>, chill out`);
    }
  }
});
