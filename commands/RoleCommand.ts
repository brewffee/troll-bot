import { Message, Role, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

export const RoleCommand = new TrollCommand(client, {
  name: 'role',
  description: 'decorate yourself with some custom roles',
  arguments: [{ name: 'Role', type: 'ROLE', required: false }],
  async run(message: Message, args: [Role], flags: Map<string, string>) {
    try {
      if (!args[0]) {
        message.channel.send(`you've got: **${''}**`)
      }
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member!.user.username} ran command "${(this as any).info.name}"` };
    }
  },
});
