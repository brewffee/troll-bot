import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { xp } from '../xp';

export const TestCommand = new TrollCommand(client, {
  name: 'gamble',
  aliases: ['double'],
  description: 'double or nothing :))))',
  arguments: [{ name: 'Amount', type: 'NUMBER', required: false }],
  async run(message: Message, args: [number]) {
    try {
      let xpEntry = await xp.findOne({ id: message.author.id });
      if (!xpEntry || xpEntry.xp < 0) {
        message.channel.send('you dont got any karma to wager!');
      } else if (!args[0]) {
        message.channel.send('im not psychic, tell me how much you want to wager dumbass');
      }
      if (Math.floor(Math.random() * 2) === 1) {
        message.channel.send(`gg! you just turned your **${args[0]}** karma into **${args[0] * 2}**!`);
        await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp + (args[0] * 2) } });
      } else {
        message.channel.send(`oops! there goes your **${args[0]}** karma ${client.config.troll}`)
        await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp - args[0] } });
      }       
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
