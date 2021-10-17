import { GuildMember } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

export const MemberJoinEvent = new TrollEvent(client, {
  name: 'MemberJoinEvent',
  description: 'adds roles (for bots only)',
  type: 'guildMemberAdd',
  run: async (_client: TrollClient, member: GuildMember) => {
    if (member.user.bot) return member.roles.add(client.config.botRole);
  },
});
