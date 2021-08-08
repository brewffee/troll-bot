import { client, TrollClient } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const HelpCommand = new TrollCommand(client, {
  name: 'help',
  description: 'see commands and shit',
  arguments: [{ name: 'Command', type: 'STRING' }],
  async run(message) {
    try {
      let list = 'howdy, check my shit out\n';
      client.commands.forEach(c => {
        const { name, description, usage, accessibility } = c.info;
        if (accessibility?.owner) return;
        list += `**${name}** [\`${usage}\`] - ${description}\n`;      
      });
      message.channel.send(list);
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
