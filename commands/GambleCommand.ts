import { Message } from 'discord.js';
import { cooldown } from '../models/GamblingCooldown';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { xp } from '../models/xp';
import { debt } from '../models/Debt';

export const TestCommand = new TrollCommand(client, {
  name: 'gamble',
  aliases: ['double'],
  description: 'double or nothing :))))',
  arguments: [{ name: 'Amount', type: 'NUMBER', required: false }],
  async run(message: Message, args: [number]) {
    try {
      let xpEntry = await xp.findOne({ id: message.author.id });
      let lastGamble = await cooldown.findOne({ id: message.author.id });
      if (!xpEntry || xpEntry.xp < 0) {
        message.channel.send('you dont got any karma to wager!');
        return;
      } else if (!args[0] || args[0] === 0) {
        message.channel.send('im not psychic, tell me how much you want to wager dumbass');
        return;
      } else if (args[0] > xpEntry.xp) {
        message.channel.send('you know you dont have that kind of money');
        return;
      } else if ((Date.now() - lastGamble?.time) / 1000 < 30) {
        message.channel.send('slow down man, you\'re only allowed to gamble once every 30 seconds');
        return;
      }
      
      if (Math.floor(Math.random() * 2) === 1) {
        message.channel.send(`gg! you just turned your **${args[0]}** karma into **${args[0] * 2}**!`);
        await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp + (args[0] * 2) } });
      } else {
        message.channel.send(`oops! there goes your **${args[0]}** karma ${client.config.troll}`)
        await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp - args[0] } });
        const existing = await debt.findOne({ id: 1 });
        // await (new debt({ id: 1, karma: 0 - args[0] })).save()
        // the above NEEDS to be run on a first start!
        await debt.findOneAndUpdate({ id: 1 }, { $set: { karma: existing.karma  - args[0] } });
      }       

      if (lastGamble)
        await cooldown.findOneAndUpdate({ id: message.author.id }, { $set: { time: Date.now() } });
      else 
        await (new cooldown({ id: message.author.id, time: Date.now() })).save()
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
