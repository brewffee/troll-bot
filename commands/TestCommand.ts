import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const TestCommand = new TrollCommand(client, {
  name: 'test',
  aliases: ['alias'],
  description: 'lists troll data',
  accessibility: {
    owner: true,
  },
  async run(message) {
    throw new Error();
  }
});
