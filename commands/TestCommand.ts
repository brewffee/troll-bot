import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const TestCommand = new TrollCommand(client, {
  name: 'test',
  aliases: ['alias'],
  description: 'emj',
  argCount: undefined,
  usage: '',
  permissions: {
    client: ['MANAGE_MESSAGES'],
    user: ['MANAGE_EMOJIS'],
  },
  accessibility: {
    owner: true,
  },
  async run(message, args, flags) {
    try {
      message.channel.send('<:water:689488678380503041>');
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: '${user} ran command "${command.constructir}"' };
    }
  },
});
