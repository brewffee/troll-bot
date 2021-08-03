import { client, TrollClient } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { Permissions } from 'discord.js';

export const TestCommand = new TrollCommand(client, {
  name: 'test',
  aliases: ['alias'],
  description: 'lists troll data',
  argCount: undefined,
  usage: '',
  permissions: {
    client: [Permissions.FLAGS.MANAGE_MESSAGES],
    user: [Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS],
  },
  accessibility: {
    owner: true,
  },
  async run(message) {
    try {
      message.channel.send(Array.from((message.client as TrollClient).commands).toString().replace(/,?\[object Object\]/g, ''));
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: '${user} ran command "${command.constructir}"' };
    }
  },
});
