import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const EvalCommand = new TrollCommand(client, {
  name: 'eval',
  aliases: ['e'],
  description: 'evaluates code',
  accessibility: {
    owner: true,
  },
  async run(message: Message, _args, flags: Map<string, string>) {
    const args = message.content.slice(1, message.content.length - (client.config.troll as string).length).trim()
    .split(/ +/g).filter((a) => !/^--(.*)/.test(a));

    try {
      // Eval code and filter out client token
      const evaluation = await eval(`(async()=>{ ${flags.get('m') ? '' : 'return'} ${args.join(' ')}; })();`);
      const res: string = require('util').inspect(evaluation,{ depth: 0 }).toString()
      .replace(message.client.token, '').replace(/`/g, '`\u200b');

      // If you really need to eval something more than 2000 characters, you can edit the 
      // bot manually. This isn't part of the bot's main feature set, so it won't be 
      // supported by default.
      message.channel.send((res.length >= 2000) ? 'rats, its too long.' : res);
    } catch (error) {
      message.channel.send(`oops!\n${error.toString().replace(/`/g, '`\u200b')}`);
    }
    
    return;
  }
});
