import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const TestCommand = new TrollCommand(client, {
  name: 'eval',
  aliases: ['e'],
  description: 'evaluates code',
  accessibility: {
    owner: true,
  },
  async run(message: Message, _args, flags: Map<string, string>) {
    try {
      // redefine args
      const args = message.content.slice(1, message.content.length - (client.config.troll as string).length).trim()
      .split(/ +/g).filter((a) => !/^--(.*)/.test(a));
      try {

        console.log(flags)
        const res = require('util').inspect(
          await eval(`(async()=>{ ${flags.get('m') ? '' : 'return'} ${args.join(' ')}; })();`),
          { depth: 0 }).toString().replace(message.client.token, '').replace(/`/g, '`\u200b');
        message.channel.send((res.toString().length >= 2000) ? `rats, its too long.` : res);
      } catch (error) {
        message.channel.send(`oops!\n${error.toString().replace(/`/g, '`\u200b')}`);
      }
      return;
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
