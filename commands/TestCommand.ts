import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const TestCommand = new TrollCommand(client, {
  name: 'test',
  aliases: ['alias'],
  description: 'lists troll data',
  accessibility: {
    owner: true,
  },
  async run(message: Message) {
    try {
      return;
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
