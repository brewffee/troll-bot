import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

export const DailyCommand = new TrollCommand(client, {
  name: 'daily',
  aliases: ['d', '24', 'collect'],
  description: 'collect your daily coins',
  async run(message: Message) {
    try {
      const user = await UserData.findOne({ id: message.author.id });

      const randomEvent = () => {
        const events = Object.keys(client.config.dailyEvents);        
        return client.config.dailyEvents[events[Math.floor(Math.random() * 10)]];
      }; 
      
      if ((Date.now() - user.lastDaily) >= (1000 * 60 * 60 * 24)) {
        let chosen = randomEvent();
        let msg = 'heres ya daily **250** coins';
        let deduction = 0;

        if (chosen) {
          // Bad luck !
          msg = chosen.message + msg;
          deduction = chosen.amount;
        }
        console.log(chosen);

        message.channel.send(msg);

        await UserData.findOneAndUpdate(
          { id: message.author.id }, 
          { 
            $set: { 
              balance: (user.balance + 250) - deduction ,
              //lastDaily: Date.now()
            } 
          }
        );
      } else {
        message.channel.send(`you collected your daily <t:${Math.trunc(user.lastDaily / 1000)}:R>, chill out`);
      }

    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
