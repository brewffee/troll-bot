import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { UserData } from '../models/User';

export const GambleCommand = new TrollCommand(client, {
  name: 'gamble',
  aliases: ['double'],
  description: 'double or nothing :))))',
  arguments: [{ name: 'Amount', type: 'NUMBER', required: false }],
  async run(message: Message, args: [number]) {
    const user = await UserData.findOne({ id: message.author.id });

    if (user.balance <= 0) {
      // message.channel.send('you dont got any coins to wager!');
      // return;
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: 'you dont got any coins to wager!'
      });
    } else if (!args[0] || args[0] === 0) {
      // message.channel.send('im not psychic, tell me how much you want to wager dumbass');
      // return;
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: 'im not psychic, tell me how much you want to wager dumbass'
      });
    } else if (args[0] > user.balance) {
      // message.channel.send('you know you dont have that kind of money');
      // return;
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: 'you know you dont have that kind of money'
      });
    } else if ((Date.now() - user.lastGamble) / 1000 < 15) {
      // message.channel.send('slow down man, you\'re only allowed to gamble once every 15 seconds');
      // return;
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: 'slow down man, you\'re only allowed to gamble once every 15 seconds'
      });
    }
    
    // if gamble amount is x value... vary answers (poor/rich)
    let isSuccessful = Math.random() > 0.5;
    if (isSuccessful) {
      await UserData.findOneAndUpdate(
        { id: message.author.id },
        { 
          $set: { 
            balance: user.balance + args[0],
            lastGamble: Date.now()
          }
        }
      );

      // message.channel.send(`gg! you just turned your **${args[0]}** coins into **${args[0] * 2}**!\nyou've now got **${user.balance + args[0]}** coins`);       
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: `gg! you just turned your **${args[0]}** coins into **${args[0] * 2}**!\nyou've now got **${user.balance + args[0]}** coins`
      });
    } else {
      await UserData.findOneAndUpdate(
        { id: message.author.id },
        { 
          $set: { 
            balance: user.balance - args[0],
            lastGamble: Date.now()
          }
        }
      );

      // message.channel.send(`oops! there goes your **${args[0]}** coins ${client.config.troll}\nyou've now got **${user.balance - args[0]}** coins`);            
      return message.reply({ 
        allowedMentions: { repliedUser: false },
        content: `oops! there goes your **${args[0]}** coins ${client.config.troll}\nyou've now got **${user.balance - args[0]}** coins`
      });
    }
  }
});
