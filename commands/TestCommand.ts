import { client, TrollClient } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const TestCommand = new TrollCommand(client, {
  name: 'test',
  aliases: ['alias'],
  description: 'lists troll data',
  usage: 'test:troll:',
  accessibility: {
    owner: true,
  },
  async run(message) {
    try {
      message.channel.send(Array.from((message.client as TrollClient).commands).toString().replace(/,?\[object Object\]/g, ''));
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name }"` };
    }
  }
});
